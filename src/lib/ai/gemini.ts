interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

export class GeminiService {
  private apiKey: string
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models'

  constructor() {
    this.apiKey = process.env.GOOGLE_AI_API_KEY!
    if (!this.apiKey) {
      throw new Error('GOOGLE_AI_API_KEY is not set')
    }
  }

  async generateItinerary(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Gemini API error response:', errorText)
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
      }

      const data: GeminiResponse = await response.json()
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response candidates from Gemini API')
      }

      const text = data.candidates[0]?.content?.parts[0]?.text
      if (!text) {
        throw new Error('Empty response from Gemini API')
      }

      return text
    } catch (error) {
      console.error('Gemini API error:', error)
      
      if (error instanceof Error) {
        throw new Error(`Failed to generate itinerary with AI: ${error.message}`)
      }
      
      throw new Error('Failed to generate itinerary with AI: Unknown error')
    }
  }

  // Alternative method for testing connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello, respond with just "OK" to test the connection.'
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 10,
          }
        }),
      })

      return response.ok
    } catch (error) {
      console.error('Gemini connection test failed:', error)
      return false
    }
  }

  // Method to get available models (for future use)
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`)
      }

      const data: { models?: Array<{ name: string }> } = await response.json()
      return data.models?.map((model) => model.name) || []
    } catch (error) {
      console.error('Error fetching available models:', error)
      return ['gemini-pro'] // fallback
    }
  }
}