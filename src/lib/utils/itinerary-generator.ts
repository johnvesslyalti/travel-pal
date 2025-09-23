import { GeminiService } from '../ai/gemini'
import { PlacesService } from '../services/places'
import { WeatherService } from '../services/weather'
import { BudgetRange, TravelStyle } from '@prisma/client'

/* ---------- Service Response Types ---------- */
export interface Place {
  name: string
  rating?: number
  geometry?: {
    location: { lat: number; lng: number }
  }
}

export interface WeatherForecast {
  date: string
  weather: { description: string }
  temperature: { day: number }
}

/* ---------- Request / Response Types ---------- */
export interface ItineraryRequest {
  destination: string
  startDate: Date
  endDate: Date
  budget: number
  budgetRange: BudgetRange
  groupSize: number
  travelStyle: TravelStyle
  interests: string[]
  dietaryRequirements?: string[]
  mobilityRequirements?: string[]
}

export interface GeneratedItinerary {
  summary: string
  highlights: string[]
  estimatedCost: number
  days: Array<{
    dayNumber: number
    date: Date
    title: string
    summary: string
    estimatedCost: number
    weather?: WeatherForecast | null
    activities: Array<{
      title: string
      description: string
      category: string
      location: string
      coordinates?: string
      startTime: string
      endTime: string
      duration: number
      estimatedCost: number
      tips: string
      order: number
    }>
  }>
}

/* ---------- Generator Class ---------- */
export class ItineraryGenerator {
  private geminiService: GeminiService
  private placesService: PlacesService
  private weatherService: WeatherService

  constructor() {
    this.geminiService = new GeminiService()
    this.placesService = new PlacesService()
    this.weatherService = new WeatherService()
  }

  async generate(request: ItineraryRequest): Promise<GeneratedItinerary> {
    const duration = Math.ceil(
      (request.endDate.getTime() - request.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )

    // Get location data
    const places: Place[] = await this.placesService.searchPlaces(
      `tourist attractions ${request.destination}`
    )

    // Get weather forecast if coordinates available
    let weatherData: WeatherForecast[] = []
    if (places.length > 0 && places[0].geometry) {
      try {
        weatherData = await this.weatherService.getForecast(
          places[0].geometry.location.lat,
          places[0].geometry.location.lng,
          duration
        )
      } catch (error) {
        console.warn('Weather data unavailable:', error)
      }
    }

    // Create AI prompt
    const prompt = this.createPrompt(request, duration, places, weatherData)

    // Generate with AI
    const aiResponse = await this.geminiService.generateItinerary(prompt)

    // Parse and structure the response
    return this.parseAIResponse(aiResponse, request, weatherData)
  }

  private createPrompt(
    request: ItineraryRequest,
    duration: number,
    places: Place[],
    weather: WeatherForecast[]
  ): string {
    return `Create a detailed ${duration}-day travel itinerary for ${request.destination}.

TRAVELER PROFILE:
- Group size: ${request.groupSize} people
- Budget: $${request.budget} (${request.budgetRange} range)
- Travel style: ${request.travelStyle}
- Interests: ${request.interests.join(', ')}
${request.dietaryRequirements?.length ? `- Dietary requirements: ${request.dietaryRequirements.join(', ')}` : ''}
${request.mobilityRequirements?.length ? `- Mobility requirements: ${request.mobilityRequirements.join(', ')}` : ''}

TRAVEL DATES: ${request.startDate.toDateString()} to ${request.endDate.toDateString()}

WEATHER FORECAST:
${weather.map(w => `${w.date}: ${w.weather.description}, ${Math.round(w.temperature.day)}°C`).join('\n')}

POPULAR ATTRACTIONS:
${places.slice(0, 10).map(p => `- ${p.name} (Rating: ${p.rating ?? 'N/A'})`).join('\n')}

Please create a JSON response with this exact structure:
{
  "summary": "Brief trip overview",
  "highlights": ["key attraction 1", "key attraction 2", "key attraction 3"],
  "estimatedCost": total_estimated_cost_number,
  "days": [
    {
      "dayNumber": 1,
      "title": "Day 1: Theme",
      "summary": "What to expect this day",
      "estimatedCost": day_cost_number,
      "activities": [
        {
          "title": "Activity name",
          "description": "Detailed description",
          "category": "SIGHTSEEING|RESTAURANT|ENTERTAINMENT|etc",
          "location": "Specific address or area",
          "startTime": "09:00",
          "endTime": "11:00",
          "duration": 120,
          "estimatedCost": cost_number,
          "tips": "Helpful tips for this activity",
          "order": 1
        }
      ]
    }
  ]
}

Make sure to:
1. Include realistic timing and costs
2. Consider weather in activity selection
3. Mix of must-see attractions and local experiences
4. Account for travel time between locations
5. Include meal recommendations
6. Provide practical tips
7. Stay within budget constraints`
  }

  private parseAIResponse(
    aiResponse: string,
    request: ItineraryRequest,
    weather: WeatherForecast[]
  ): GeneratedItinerary {
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }

      const parsed = JSON.parse(jsonMatch[0]) as Omit<GeneratedItinerary, 'days'> & {
        days: Array<Omit<GeneratedItinerary['days'][number], 'date' | 'weather'>>
      }

      // Add weather and real Date objects
      const days: GeneratedItinerary['days'] = parsed.days.map((day, index) => ({
        ...day,
        date: new Date(
          request.startDate.getTime() + index * 24 * 60 * 60 * 1000
        ),
        weather: weather[index] ?? null
      }))

      return {
        ...parsed,
        days
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error)

      // Fallback basic itinerary
      const duration = Math.ceil(
        (request.endDate.getTime() - request.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )

      return {
        summary: `A ${duration}-day trip to ${request.destination}`,
        highlights: ['Explore local attractions', 'Try local cuisine', 'Cultural experiences'],
        estimatedCost: request.budget,
        days: Array.from({ length: duration }, (_, i) => ({
          dayNumber: i + 1,
          date: new Date(request.startDate.getTime() + i * 24 * 60 * 60 * 1000),
          title: `Day ${i + 1}: Exploring ${request.destination}`,
          summary: 'A day of discovery and adventure',
          estimatedCost: request.budget / duration,
          weather: weather[i] ?? null,
          activities: [
            {
              title: 'Morning exploration',
              description: 'Start your day with local sightseeing',
              category: 'SIGHTSEEING',
              location: request.destination,
              startTime: '09:00',
              endTime: '12:00',
              duration: 180,
              estimatedCost: (request.budget / duration) * 0.4,
              tips: 'Book tickets in advance if possible',
              order: 1
            },
            {
              title: 'Local lunch',
              description: 'Try authentic local cuisine',
              category: 'RESTAURANT',
              location: request.destination,
              startTime: '12:00',
              endTime: '13:30',
              duration: 90,
              estimatedCost: (request.budget / duration) * 0.3,
              tips: 'Ask locals for recommendations',
              order: 2
            },
            {
              title: 'Afternoon activity',
              description: 'Continue exploring the area',
              category: 'ACTIVITY',
              location: request.destination,
              startTime: '14:30',
              endTime: '17:00',
              duration: 150,
              estimatedCost: (request.budget / duration) * 0.3,
              tips: 'Take your time and enjoy the experience',
              order: 3
            }
          ]
        }))
      }
    }
  }
}
