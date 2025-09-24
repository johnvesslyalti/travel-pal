'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Share2,
  Download,
  CheckCircle,
  Star,
  Cloud,
  Thermometer
} from 'lucide-react'
import { Layout } from '@/components/Layout/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'

interface Weather {
  weather?: { main?: string }
  temperature?: { day?: number }
}

interface Activity {
  id: string
  title: string
  description: string
  category: string
  location: string
  startTime: string
  endTime: string
  duration: number
  estimatedCost: number
  tips: string
  order: number
  isCompleted: boolean
  userNotes?: string
}

interface ItineraryDay {
  id: string
  dayNumber: number
  date: string
  title: string
  summary: string
  estimatedCost: number
  weather?: Weather
  activities: Activity[]
}

interface Itinerary {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  duration: number
  estimatedCost: number
  summary: string
  highlights: string[]
  status: string
  isPublic: boolean
  days: ItineraryDay[]
}

export default function ItineraryDetail() {
  const params = useParams()
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLoading] = useState(true)
  const [feedbackModal, setFeedbackModal] = useState(false)
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    if (params.id) {
      fetchItinerary(params.id as string)
    }
  }, [params.id])

  const fetchItinerary = async (id: string) => {
    try {
      const response = await fetch(`/api/itineraries/${id}`)
      if (response.ok) {
        const data = await response.json()
        setItinerary(data)
      }
    } catch (error) {
      console.error('Error fetching itinerary:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleActivityComplete = async (activityId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: completed })
      })

      if (response.ok) {
        setItinerary(prev => {
          if (!prev) return prev
          return {
            ...prev,
            days: prev.days.map(day => ({
              ...day,
              activities: day.activities.map(activity =>
                activity.id === activityId
                  ? { ...activity, isCompleted: completed }
                  : activity
              )
            }))
          }
        })
      }
    } catch (error) {
      console.error('Error updating activity:', error)
    }
  }

  const handleShare = async () => {
    try {
      const response = await fetch(`/api/itineraries/${params.id}/share`, {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        navigator.clipboard.writeText(data.shareUrl)
        alert('Share link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing itinerary:', error)
    }
  }

  const submitFeedback = async () => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itineraryId: params.id,
          rating: feedback.rating,
          comment: feedback.comment,
          category: 'ITINERARY_QUALITY'
        })
      })

      if (response.ok) {
        setFeedbackModal(false)
        setFeedback({ rating: 5, comment: '' })
        alert('Thank you for your feedback!')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      SIGHTSEEING: '🏛️',
      RESTAURANT: '🍽️',
      ENTERTAINMENT: '🎭',
      SHOPPING: '🛍️',
      TRANSPORTATION: '🚗',
      ACCOMMODATION: '🏨',
      ACTIVITY: '🎯',
      MUSEUM: '🏛️',
      PARK: '🌳',
      BEACH: '🏖️',
      NIGHTLIFE: '🌃',
      CULTURAL: '🎨',
      ADVENTURE: '⛰️',
      WELLNESS: '🧘',
      BUSINESS: '💼',
      OTHER: '📍'
    }
    return icons[category] || '📍'
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!itinerary) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Itinerary not found
            </h2>
            <p className="text-gray-600">
              The itinerary you&apos;re looking for doesn&apos;t exist or you
              don&apos;t have access to it.
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  const completedActivities = itinerary.days.reduce(
    (acc, day) => acc + day.activities.filter(a => a.isCompleted).length,
    0
  )
  const totalActivities = itinerary.days.reduce(
    (acc, day) => acc + day.activities.length,
    0
  )
  const progress =
    totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {itinerary.title}
              </h1>
              <div className="flex items-center text-gray-600 space-x-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{itinerary.destination}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>
                    {new Date(itinerary.startDate).toLocaleDateString()} -
                    {new Date(itinerary.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>${itinerary.estimatedCost?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={() => setFeedbackModal(true)}>
                <Star className="w-4 h-4 mr-2" />
                Feedback
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {totalActivities > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Trip Progress</span>
                <span>
                  {completedActivities} / {totalActivities} activities completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Trip Summary */}
        {itinerary.summary && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Trip Overview
            </h2>
            <p className="text-gray-700 mb-4">{itinerary.summary}</p>

            {itinerary.highlights && itinerary.highlights.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {itinerary.highlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Daily Itinerary */}
        <div className="space-y-8">
          {itinerary.days.map(day => (
            <Card key={day.id} className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {day.title || `Day ${day.dayNumber}`}
                  </h2>
                  <div className="flex items-center text-gray-600 space-x-4 mb-2">
                    <span>
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {day.estimatedCost && (
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${day.estimatedCost.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {day.summary && (
                    <p className="text-gray-700">{day.summary}</p>
                  )}
                </div>

                {/* Weather Info */}
                {day.weather && (
                  <div className="flex items-center space-x-4 bg-blue-50 p-4 rounded-lg">
                    <div className="text-center">
                      <Cloud className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                      <div className="text-sm text-blue-700">
                        {day.weather.weather?.main || 'Clear'}
                      </div>
                    </div>
                    <div className="text-center">
                      <Thermometer className="w-8 h-8 text-red-500 mx-auto mb-1" />
                      <div className="text-sm text-red-700">
                        {Math.round(day.weather.temperature?.day ?? 20)}°C
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Activities */}
              <div className="space-y-4">
                {day.activities
                  .sort((a, b) => a.order - b.order)
                  .map(activity => (
                    <div
                      key={activity.id}
                      className={`p-4 border rounded-xl transition-all ${
                        activity.isCompleted
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <button
                          onClick={() =>
                            toggleActivityComplete(
                              activity.id,
                              !activity.isCompleted
                            )
                          }
                          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            activity.isCompleted
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-purple-500'
                          }`}
                        >
                          {activity.isCompleted && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl">
                              {getCategoryIcon(activity.category)}
                            </span>
                            <h3
                              className={`font-semibold ${
                                activity.isCompleted
                                  ? 'text-green-700 line-through'
                                  : 'text-gray-900'
                              }`}
                            >
                              {activity.title}
                            </h3>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {activity.category.toLowerCase()}
                            </span>
                          </div>

                          <p className="text-gray-700 mb-3">
                            {activity.description}
                          </p>

                          <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>
                                {activity.startTime} - {activity.endTime}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{activity.location}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-4 h-4 mr-1">⏱️</span>
                              <span>{activity.duration} min</span>
                            </div>
                            {activity.estimatedCost > 0 && (
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                <span>${activity.estimatedCost}</span>
                              </div>
                            )}
                          </div>

                          {activity.tips && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                              <p className="text-sm text-yellow-800">
                                <span className="font-medium">💡 Tip:</span>{' '}
                                {activity.tips}
                              </p>
                            </div>
                          )}

                          {activity.userNotes && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-sm text-blue-800">
                                <span className="font-medium">📝 Notes:</span>{' '}
                                {activity.userNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Feedback Modal */}
        <Modal
          isOpen={feedbackModal}
          onClose={() => setFeedbackModal(false)}
          title="Rate Your Experience"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How would you rate this itinerary?
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() =>
                      setFeedback(prev => ({ ...prev, rating: star }))
                    }
                    className={`w-8 h-8 ${
                      star <= feedback.rating
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    <Star className="w-full h-full fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (optional)
              </label>
              <textarea
                value={feedback.comment}
                onChange={e =>
                  setFeedback(prev => ({ ...prev, comment: e.target.value }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
                placeholder="Share your thoughts about this itinerary..."
              />
            </div>

            <div className="flex space-x-4 justify-end">
              <Button
                variant="outline"
                onClick={() => setFeedbackModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={submitFeedback}>Submit Feedback</Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  )
}
