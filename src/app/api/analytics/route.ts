import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/analytics - Get user analytics
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get various statistics
    const [
      totalItineraries,
      completedItineraries,
      totalCountries,
      avgRating,
      recentActivity
    ] = await Promise.all([
      prisma.itinerary.count({
        where: { userId }
      }),
      prisma.itinerary.count({
        where: { userId, status: 'COMPLETED' }
      }),
      prisma.itinerary.groupBy({
        by: ['country'],
        where: { userId, country: { not: null } }
      }),
      prisma.feedback.aggregate({
        where: { userId },
        _avg: { rating: true }
      }),
      prisma.itinerary.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          destination: true,
          status: true,
          createdAt: true
        }
      })
    ])

    return NextResponse.json({
      stats: {
        totalItineraries,
        completedItineraries,
        uniqueCountries: totalCountries.length,
        averageRating: avgRating._avg.rating || 0
      },
      recentActivity
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}