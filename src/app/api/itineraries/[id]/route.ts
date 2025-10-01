import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateItinerarySchema } from '@/lib/utils/validation'
import { auth } from '@/lib/auth'

interface RouteParams {
  params: { id: string }
}

// GET /api/itineraries/[id] - Get specific itinerary
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id: itineraryId } = await params

    // Check if public or user owns it
    const itinerary = await prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        OR: [
          { userId: session?.user?.id },
          { isPublic: true }
        ]
      },
      include: {
        days: {
          include: {
            activities: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { dayNumber: 'asc' }
        },
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    if (!itinerary) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 })
    }

    return NextResponse.json(itinerary)
  } catch (error) {
    console.error('Error fetching itinerary:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/itineraries/[id] - Update itinerary
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const itineraryId = params.id
    const body = await request.json()
    const validatedData = updateItinerarySchema.parse(body)

    // Verify ownership
    const existing = await prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        userId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 })
    }

    const updated = await prisma.itinerary.update({
      where: { id: itineraryId },
      data: validatedData,
      include: {
        days: {
          include: {
            activities: true
          }
        }
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating itinerary:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/itineraries/[id] - Delete itinerary
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const itineraryId = params.id

    // Verify ownership
    const existing = await prisma.itinerary.findFirst({
      where: {
        id: itineraryId,
        userId: session.user.id
      }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 })
    }

    await prisma.itinerary.delete({
      where: { id: itineraryId }
    })

    return NextResponse.json({ message: 'Itinerary deleted successfully' })
  } catch (error) {
    console.error('Error deleting itinerary:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}