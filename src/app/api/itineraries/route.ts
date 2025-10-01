import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ItineraryGenerator, ItineraryRequest } from '@/lib/utils/itinerary-generator'
import { createItinerarySchema } from '@/lib/utils/validation'
import { ZodError } from 'zod'
import { auth } from '@/lib/auth'
import { Prisma, ActivityCategory, ItineraryStatus } from '@prisma/client'

const validCategories: ActivityCategory[] = ['SIGHTSEEING','RESTAURANT','ENTERTAINMENT','ACTIVITY','OTHER']

// GET /api/itineraries - Get user's itineraries
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const where = { userId: session.user.id, ...(status && { status: status as ItineraryStatus }) }

    const [itineraries, total] = await Promise.all([
      prisma.itinerary.findMany({
        where,
        include: {
          days: { include: { activities: true } },
          _count: { select: { days: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.itinerary.count({ where })
    ])

    return NextResponse.json({
      itineraries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching itineraries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/itineraries - Create new itinerary
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check subscription limits
    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.user.id, status: 'ACTIVE' }
    })

    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0,0,0,0)

    const monthlyUsage = await prisma.itinerary.count({
      where: { userId: session.user.id, createdAt: { gte: currentMonth } }
    })

    const limit = subscription?.itinerariesLimit || 5
    if (monthlyUsage >= limit)
      return NextResponse.json({ error: 'Monthly itinerary limit reached' }, { status: 403 })

    const body = await request.json()
    const validatedData = createItinerarySchema.parse(body)

    // Convert string dates to Date objects
    const itineraryRequest: ItineraryRequest = {
      ...validatedData,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
    }

    // Create initial itinerary record
    const itinerary = await prisma.itinerary.create({
      data: {
        userId: session.user.id,
        title: `Trip to ${itineraryRequest.destination}`,
        destination: itineraryRequest.destination,
        startDate: itineraryRequest.startDate,
        endDate: itineraryRequest.endDate,
        duration: Math.ceil(
          (itineraryRequest.endDate.getTime() - itineraryRequest.startDate.getTime()) / (1000*60*60*24)
        ),
        budget: itineraryRequest.budget,
        budgetRange: itineraryRequest.budgetRange,
        groupSize: itineraryRequest.groupSize,
        travelStyle: itineraryRequest.travelStyle,
        interests: itineraryRequest.interests,
        status: 'GENERATING',
      }
    })

    // Generate itinerary in background
    generateItineraryAsync(itinerary.id, itineraryRequest)

    return NextResponse.json({
      id: itinerary.id,
      status: 'GENERATING',
      message: 'Itinerary generation started'
    }, { status: 202 })

  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json({ error: 'Validation failed', details: error.format() }, { status: 400 })

    console.error('Error creating itinerary:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Background itinerary generation
async function generateItineraryAsync(itineraryId: string, data: ItineraryRequest) {
  const startTime = Date.now()

  try {
    const generator = new ItineraryGenerator()
    const generated = await generator.generate(data)

    await prisma.itinerary.update({
      where: { id: itineraryId },
      data: {
        summary: generated.summary,
        highlights: generated.highlights,
        estimatedCost: generated.estimatedCost,
        generationTime: Date.now() - startTime,
        status: 'COMPLETED',
        days: {
          create: generated.days.map(day => ({
            dayNumber: day.dayNumber,
            date: day.date,
            title: day.title,
            summary: day.summary,
            estimatedCost: day.estimatedCost,
            weather: day.weather
              ? (day.weather as unknown as Prisma.InputJsonValue)
              : Prisma.JsonNull,
            activities: {
              create: day.activities.map(activity => ({
                title: activity.title,
                description: activity.description,
                category: validCategories.includes(activity.category as ActivityCategory)
                  ? (activity.category as ActivityCategory)
                  : 'OTHER',
                location: activity.location,
                coordinates: activity.coordinates,
                startTime: activity.startTime,
                endTime: activity.endTime,
                duration: activity.duration,
                estimatedCost: activity.estimatedCost,
                tips: activity.tips,
                order: activity.order,
              })),
            }
          })),
        },
      }
    })

    await prisma.aiUsage.create({
      data: {
        model: 'gemini-pro',
        responseTime: Date.now() - startTime,
        success: true,
        endpoint: '/api/itineraries',
      }
    })

  } catch (error) {
    console.error('Error generating itinerary:', error)

    await prisma.itinerary.update({
      where: { id: itineraryId },
      data: {
        status: 'FAILED',
        generationTime: Date.now() - startTime,
      }
    })

    await prisma.aiUsage.create({
      data: {
        model: 'gemini-pro',
        responseTime: Date.now() - startTime,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        endpoint: '/api/itineraries',
      }
    })
  }
}
