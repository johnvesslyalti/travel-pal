export interface PlaceData {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  rating?: number
  user_ratings_total?: number
  types: string[]
  photos?: Array<{
    photo_reference: string
  }>
}

export class PlacesService {
  private apiKey: string
  private baseUrl = 'https://maps.googleapis.com/maps/api/place'

  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY!
  }

  async searchPlaces(query: string, location?: string): Promise<PlaceData[]> {
    try {
      const params = new URLSearchParams({
        query,
        key: this.apiKey,
        ...(location && { location, radius: '50000' })
      })

      const response = await fetch(`${this.baseUrl}/textsearch/json?${params}`)
      const data = await response.json()

      if (data.status !== 'OK') {
        throw new Error(`Places API error: ${data.status}`)
      }

      return data.results || []
    } catch (error) {
      console.error('Places API error:', error)
      throw new Error('Failed to fetch places data')
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceData> {
    try {
      const params = new URLSearchParams({
        place_id: placeId,
        key: this.apiKey,
        fields: 'place_id,name,formatted_address,geometry,rating,user_ratings_total,types,photos'
      })

      const response = await fetch(`${this.baseUrl}/details/json?${params}`)
      const data = await response.json()

      if (data.status !== 'OK') {
        throw new Error(`Places API error: ${data.status}`)
      }

      return data.result
    } catch (error) {
      console.error('Places API error:', error)
      throw new Error('Failed to fetch place details')
    }
  }
}