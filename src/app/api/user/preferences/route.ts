import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const preferencesSchema = z.object({
  preferredBudget: z.enum(['ULTRA_BUDGET', 'BUDGET', 'MID_RANGE', 'LUXURY', 'ULTRA_LUXURY']),
  travelStyle: z.enum(['ADVENTURE', 'CULTURAL', 'RELAXED', 'FOODIE', 'NIGHTLIFE', 'FAMILY', 'ROMANTIC', 'BUSINESS', 'SOLO', 'BALANCED']),
  interests: z.array(z.string()),
  dietaryRequirements: z.array(z.string()),
  mobilityRequirements: z.array(z.string()),
  preferredLanguage: z.string(),
  currency: z.string(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
})

// GET /api/user/preferences - Get user preferences
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/user/preferences - Update user preferences
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = preferencesSchema.parse(body)

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: validatedData,
      create: {
        userId: session.user.id,
        ...validatedData
      }
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}