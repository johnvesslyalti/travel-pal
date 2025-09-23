import { NextRequest, NextResponse } from 'next/server'
import { PlacesService } from '@/lib/services/places'

// GET /api/places/search - Search for places
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const location = searchParams.get('location')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const placesService = new PlacesService()
    const places = await placesService.searchPlaces(query, location || undefined)

    return NextResponse.json({ places })
  } catch (error) {
    console.error('Error searching places:', error)
    return NextResponse.json({ error: 'Failed to search places' }, { status: 500 })
  }
}
