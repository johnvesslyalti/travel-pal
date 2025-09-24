import Link from 'next/link'
import { MapPin, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-12 h-12 text-purple-600" />
        </div>
        
        <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-8">
          Looks like you&apos;ve wandered off the beaten path! The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button className="flex items-center justify-center space-x-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button 
              variant="outline"
              className="flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <Search className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}