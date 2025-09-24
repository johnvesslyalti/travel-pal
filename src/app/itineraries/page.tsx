"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Calendar, DollarSign, Share2, Trash2, Plus, Filter } from 'lucide-react'
import { Layout } from '@/components/Layout/Layout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'

interface Itinerary {
  id: string
  title: string
  destination: string
  startDate: string
  endDate: string
  duration: number
  estimatedCost: number
  status: string
  isPublic: boolean
  createdAt: string
  _count: {
    days: number
  }
}

export default function Itineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, itinerary: Itinerary | null}>({
    isOpen: false,
    itinerary: null
  })

  const fetchItineraries = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)
      
      const response = await fetch(`/api/itineraries?${params}`)
      if (response.ok) {
        const data = await response.json()
        setItineraries(data.itineraries)
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItineraries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const handleDelete = async (itinerary: Itinerary) => {
    try {
      const response = await fetch(`/api/itineraries/${itinerary.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setItineraries(prev => prev.filter(i => i.id !== itinerary.id))
        setDeleteModal({ isOpen: false, itinerary: null })
      }
    } catch (error) {
      console.error('Error deleting itinerary:', error)
    }
  }

  const handleShare = async (itinerary: Itinerary) => {
    try {
      const response = await fetch(`/api/itineraries/${itinerary.id}/share`, {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-600'
      case 'GENERATING': return 'bg-yellow-100 text-yellow-600'
      case 'SHARED': return 'bg-blue-100 text-blue-600'
      case 'FAILED': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Itineraries</h1>
            <p className="text-gray-600 mt-2">Manage and explore your travel plans</p>
          </div>
          <Link href="/create">
            <Button className="flex items-center space-x-2">
              <Plus size={20} />
              <span>New Trip</span>
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex space-x-2">
            {['all', 'COMPLETED', 'GENERATING', 'DRAFT', 'SHARED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Itineraries Grid */}
        {itineraries.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
              <Card key={itinerary.id} hover className="overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {itinerary.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{itinerary.destination}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(itinerary.status)}`}>
                      {itinerary.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(itinerary.startDate).toLocaleDateString()} - 
                        {new Date(itinerary.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>${itinerary.estimatedCost?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 mr-2 text-center">📅</span>
                      <span>{itinerary.duration} days • {itinerary._count.days} activities</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/itineraries/${itinerary.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(itinerary)}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteModal({ isOpen: true, itinerary })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MapPin className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              No itineraries yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start planning your next adventure! Create your first itinerary and let our AI help you discover amazing destinations.
            </p>
            <Link href="/create">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Plan Your First Trip
              </Button>
            </Link>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, itinerary: null })}
          title="Delete Itinerary"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete &quot;{deleteModal.itinerary?.title}&quot;? 
              This action cannot be undone.
            </p>
            <div className="flex space-x-4 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ isOpen: false, itinerary: null })}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => deleteModal.itinerary && handleDelete(deleteModal.itinerary)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  )
}
