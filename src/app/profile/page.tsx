"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { User, Settings, Bell, CreditCard } from 'lucide-react'
import { Layout } from '@/components/Layout/Layout'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

// Types
type BudgetOption = 'ULTRA_BUDGET' | 'BUDGET' | 'MID_RANGE' | 'LUXURY' | 'ULTRA_LUXURY'
type TravelStyle =
  | 'ADVENTURE' | 'CULTURAL' | 'RELAXED' | 'FOODIE' | 'NIGHTLIFE'
  | 'FAMILY' | 'ROMANTIC' | 'BUSINESS' | 'SOLO' | 'BALANCED'

interface Preferences {
  preferredBudget: BudgetOption
  travelStyle: TravelStyle
  interests: string[]
  dietaryRequirements: string[]
  mobilityRequirements: string[]
  preferredLanguage: string
  currency: string
  emailNotifications: boolean
  pushNotifications: boolean
}

// Main Component
export default function Profile() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications' | 'subscription'>('profile')
  const [preferences, setPreferences] = useState<Preferences>({
    preferredBudget: 'MID_RANGE',
    travelStyle: 'BALANCED',
    interests: [],
    dietaryRequirements: [],
    mobilityRequirements: [],
    preferredLanguage: 'en',
    currency: 'USD',
    emailNotifications: true,
    pushNotifications: true
  })

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/user/preferences')
        if (response.ok) {
          const data: Preferences = await response.json()
          setPreferences(data)
        }
      } catch (error) {
        console.error('Error fetching preferences:', error)
      }
    }
    fetchPreferences()
  }, [])

  const tabs: { id: typeof activeTab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Travel Preferences', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'subscription', label: 'Subscription', icon: CreditCard }
  ]

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and personalize your travel experience</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    {session?.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        alt="Profile" 
                        width={80} 
                        height={80} 
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-purple-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{session?.user?.name || 'User'}</h3>
                      <p className="text-gray-600">{session?.user?.email}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input label="Full Name" value={session?.user?.name || ''} placeholder="Enter your full name" />
                    <Input label="Email" value={session?.user?.email || ''} disabled className="bg-gray-50" />
                  </div>

                  <div className="pt-4">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'preferences' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Travel Preferences</h2>
                <p className="text-gray-600">Preferences UI goes here...</p>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2>
                <p className="text-gray-600">Notifications settings UI goes here...</p>
              </Card>
            )}

            {activeTab === 'subscription' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription</h2>
                <p className="text-gray-600">Subscription details UI goes here...</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
