"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, User, LogOut, Settings, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import Image from 'next/image'

export function Navbar() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">TP</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Travel Pal
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {status === 'authenticated' ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link href="/itineraries" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  My Trips
                </Link>
                <Button 
                  size="sm"
                  onClick={() => window.location.href = '/create'}
                  className="flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>New Trip</span>
                </Button>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
                    {session.user?.image ? (
                      <Image width={32} height={32} src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full" />
                    ) : (
                      <User size={20} />
                    )}
                    <span className="font-medium">{session.user?.name || 'User'}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link href="/profile" className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <Settings size={16} />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/features" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Features
                </Link>
                <Link href="/pricing" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Pricing
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {status === 'authenticated' ? (
              <>
                <Link href="/dashboard" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link href="/itineraries" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  My Trips
                </Link>
                <Link href="/create" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  New Trip
                </Link>
                <Link href="/profile" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Settings
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block text-gray-700 hover:text-purple-600 transition-colors font-medium w-full text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/features" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Features
                </Link>
                <Link href="/pricing" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Pricing
                </Link>
                <Link href="/auth/signin" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Sign In
                </Link>
                <Link href="/auth/signup">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}