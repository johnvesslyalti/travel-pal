"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, MapPin, Calendar, Star, TrendingUp, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { authClient } from '@/lib/auth-client'

interface DashboardStats {
  totalItineraries: number
  completedItineraries: number
  uniqueCountries: number
  averageRating: number
}

interface RecentActivity {
  id: string
  title: string
  destination: string
  status: string
  createdAt: string
}

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user.emailVerified) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentActivity(data.recentActivity)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isPending) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }


  return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session?.user?.name || 'Traveler'}! ✈️
            </h1>
            <p className="text-gray-600 mt-2">Ready to plan your next adventure?</p>
          </div>
          <Link href="/create">
            <Button className="flex items-center space-x-2">
              <Plus size={20} />
              <span>Plan New Trip</span>
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalItineraries || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.completedItineraries || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Countries</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.uniqueCountries || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Trips</h2>
                <Link href="/itineraries" className="text-purple-600 hover:text-purple-700">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <MapPin className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{activity.title}</h3>
                          <p className="text-sm text-gray-600">{activity.destination}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activity.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                          activity.status === 'GENERATING' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No trips planned yet</p>
                    <Link href="/create">
                      <Button variant="outline">Plan Your First Trip</Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link href="/create" className="block">
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <Plus className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-600">Plan New Trip</span>
                  </div>
                </Link>
                
                <Link href="/itineraries" className="block">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-600">My Itineraries</span>
                  </div>
                </Link>
                
                <Link href="/profile" className="block">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-600">Travel Insights</span>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Subscription Info */}
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Plan</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trips this month</span>
                  <span className="font-medium">{stats?.totalItineraries || 0} / 5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(((stats?.totalItineraries || 0) / 5) * 100, 100)}%` }}
                  ></div>
                </div>
                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
  )
}
