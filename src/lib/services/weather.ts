export interface WeatherData {
  date: string
  temperature: {
    min: number
    max: number
    day: number
  }
  weather: {
    main: string
    description: string
    icon: string
  }
  humidity: number
  wind_speed: number
}

// OpenWeatherMap API response interfaces
interface OpenWeatherResponse {
  cod: string
  message?: string
  list: WeatherListItem[]
}

interface WeatherListItem {
  dt: number
  dt_txt: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  clouds: {
    all: number
  }
  visibility?: number
  pop: number
  sys: {
    pod: string
  }
}

export class WeatherService {
  private apiKey: string
  private baseUrl = 'https://api.openweathermap.org/data/2.5'

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY!
    if (!this.apiKey) {
      throw new Error('OPENWEATHER_API_KEY is not set')
    }
  }

  async getForecast(lat: number, lng: number, days: number = 7): Promise<WeatherData[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric&cnt=${days * 8}`
      )
      
      const data: OpenWeatherResponse = await response.json()

      if (data.cod !== '200') {
        throw new Error(`Weather API error: ${data.message || 'Unknown error'}`)
      }

      // Group by day and return daily forecasts
      const dailyForecasts: WeatherData[] = []
      const groupedByDay: { [key: string]: WeatherListItem[] } = {}

      data.list.forEach((item: WeatherListItem) => {
        const date = item.dt_txt.split(' ')[0]
        if (!groupedByDay[date]) {
          groupedByDay[date] = []
        }
        groupedByDay[date].push(item)
      })

      Object.keys(groupedByDay).slice(0, days).forEach(date => {
        const dayData = groupedByDay[date]
        const temps = dayData.map(d => d.main.temp)
        
        dailyForecasts.push({
          date,
          temperature: {
            min: Math.min(...temps),
            max: Math.max(...temps),
            day: dayData.find(d => d.dt_txt.includes('12:00'))?.main.temp || temps[0]
          },
          weather: dayData[0].weather[0],
          humidity: dayData[0].main.humidity,
          wind_speed: dayData[0].wind.speed
        })
      })

      return dailyForecasts
    } catch (error) {
      console.error('Weather API error:', error)
      
      if (error instanceof Error) {
        throw new Error(`Failed to fetch weather data: ${error.message}`)
      }
      
      throw new Error('Failed to fetch weather data: Unknown error')
    }
  }

  // Get current weather for a location
  async getCurrentWeather(lat: number, lng: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      )
      
      const data: CurrentWeatherResponse = await response.json()

      if (data.cod !== 200) {
        throw new Error(`Weather API error: ${data.message || 'Unknown error'}`)
      }

      return {
        date: new Date().toISOString().split('T')[0],
        temperature: {
          min: data.main.temp_min,
          max: data.main.temp_max,
          day: data.main.temp
        },
        weather: data.weather[0],
        humidity: data.main.humidity,
        wind_speed: data.wind.speed
      }
    } catch (error) {
      console.error('Current weather API error:', error)
      
      if (error instanceof Error) {
        throw new Error(`Failed to fetch current weather: ${error.message}`)
      }
      
      throw new Error('Failed to fetch current weather: Unknown error')
    }
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=London&appid=${this.apiKey}&units=metric`
      )
      
      return response.ok
    } catch (error) {
      console.error('Weather API connection test failed:', error)
      return false
    }
  }
}

// Current weather API response interface
interface CurrentWeatherResponse {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
  message?: string
}