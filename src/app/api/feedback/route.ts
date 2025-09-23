import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { feedbackSchema } from '@/lib/utils/validation'
import { auth } from '@/auth'

// POST /api/feedback - Submit feedback
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = feedbackSchema.parse(body)

    // Verify itinerary ownership if provided
    if (validatedData.itineraryId) {
      const itinerary = await prisma.itinerary.findFirst({
        where: {
          id: validatedData.itineraryId,
          userId: session.user.id
        }
      })

      if (!itinerary) {
        return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 })
      }
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: session.user.id,
        itineraryId: validatedData.itineraryId,
        rating: validatedData.rating,
        comment: validatedData.comment,
        category: validatedData.category,
        aiQuality: validatedData.aiQuality,
        usability: validatedData.usability,
        accuracy: validatedData.accuracy,
        improvements: validatedData.improvements || [],
      }
    })

    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}