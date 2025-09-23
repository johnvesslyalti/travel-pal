import { NextRequest, NextResponse } from 'next/server'
import { WeatherService } from '@/lib/services/weather'

// GET /api/weather - Get weather forecast
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '')
    const lng = parseFloat(searchParams.get('lng') || '')
    const days = parseInt(searchParams.get('days') || '7')

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'Valid lat and lng parameters are required' }, { status: 400 })
    }

    const weatherService = new WeatherService()
    const forecast = await weatherService.getForecast(lat, lng, days)

    return NextResponse.json({ forecast })
  } catch (error) {
    console.error('Error fetching weather:', error)
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}