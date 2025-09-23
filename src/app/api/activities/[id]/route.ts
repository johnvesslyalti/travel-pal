import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { auth } from '@/auth'

const updateActivitySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  estimatedCost: z.number().optional(),
  userNotes: z.string().optional(),
  isCompleted: z.boolean().optional(),
})

interface RouteParams {
  params: { id: string }
}

// PUT /api/activities/[id] - Update activity
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const activityId = params.id
    const body = await request.json()
    const validatedData = updateActivitySchema.parse(body)

    // Verify user owns the itinerary containing this activity
    const activity = await prisma.activity.findFirst({
      where: { id: activityId },
      include: {
        day: {
          include: {
            itinerary: true
          }
        }
      }
    })

    if (!activity || activity.day.itinerary.userId !== session.user.id) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    const updated = await prisma.activity.update({
      where: { id: activityId },
      data: validatedData
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating activity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
