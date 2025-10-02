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
  types: string[]
}

// Nominatim search API response type
interface NominatimPlace {
  osm_id: number
  display_name: string
  lat: string
  lon: string
  type?: string
  address?: Record<string, string>
}

// Nominatim details API response type
interface NominatimDetails {
  osm_id: number
  localname?: string
  name: string
  display_name: string
  centroid?: {
    type: string
    coordinates: [number, number]
  }
  category?: string
}

export class PlacesService {
  private baseUrl = 'https://nominatim.openstreetmap.org/search'

  constructor() {
    // No API key required for Nominatim
  }

  /**
   * Search for places by name
   */
  async searchPlaces(query: string, location?: string): Promise<PlaceData[]> {
    try {
      const q = location ? `${query}, ${location}` : query
      const params = new URLSearchParams({
        q,
        format: 'json',
        addressdetails: '1',
        limit: '10'
      })

      const response = await fetch(`${this.baseUrl}?${params}`)
      const data = (await response.json()) as NominatimPlace[]

      return data.map((place) => ({
        place_id: place.osm_id.toString(),
        name: place.display_name.split(',')[0].trim(),
        formatted_address: place.display_name,
        geometry: {
          location: {
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon)
          }
        },
        types: place.type ? [place.type] : []
      }))
    } catch (error) {
      console.error('Places API error:', error)
      throw new Error('Failed to fetch places data')
    }
  }

  /**
   * Get place details (approximated using the same search API)
   */
  async getPlaceDetails(placeId: string, osmType: 'N' | 'W' | 'R'): Promise<PlaceData> {
    try {
      const url = new URL('https://nominatim.openstreetmap.org/details.php')
      url.searchParams.set('osmtype', osmType)
      url.searchParams.set('osmid', placeId)
      url.searchParams.set('format', 'json')

      const response = await fetch(url.toString())
      const data = (await response.json()) as NominatimDetails

      const coords = data.centroid?.coordinates
      if (!coords) throw new Error('Coordinates not available for this place')

      return {
        place_id: data.osm_id.toString(),
        name: data.localname || data.name,
        formatted_address: data.display_name,
        geometry: {
          location: {
            lat: coords[1],
            lng: coords[0]
          }
        },
        types: data.category ? [data.category] : []
      }
    } catch (error) {
      console.error('Places API error:', error)
      throw new Error('Failed to fetch place details')
    }
  }
}
