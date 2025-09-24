// ==================================================
// FILE: app/page.tsx
// Main landing page
// ==================================================
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Star, MapPin, Clock, Sparkles, ArrowRight, Menu, X, Users, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">TP</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Travel Pal
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">How it Works</a>
              <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Pricing</a>
              <Link href="/auth/signin">
                <button className="text-gray-700 hover:text-purple-600 transition-colors font-medium">Sign In</button>
              </Link>
              <Link href="/auth/signup">
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">
                  Get Started Free
                </button>
              </Link>
            </div>
            
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">How it Works</a>
              <a href="#pricing" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">Pricing</a>
              <Link href="/auth/signin" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium">Sign In</Link>
              <Link href="/auth/signup">
                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300">
                  Get Started Free
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-32 left-20 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-300 mr-2" />
              <span className="text-white/90 text-sm font-medium">AI-Powered Travel Planning</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Perfect Trip,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Planned in Seconds
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your travel dreams into detailed itineraries. Our AI considers your preferences, budget, and interests to create the perfect personalized adventure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/auth/signup">
                <button className="group bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-2xl flex items-center">
                  🚀 Start Planning Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto text-white/80">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm">Trips Planned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">150+</div>
                <div className="text-sm">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white flex items-center justify-center">
                  4.9 <Star className="w-5 h-5 ml-1 text-yellow-300 fill-current" />
                </div>
                <div className="text-sm">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Travel Pal?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform makes travel planning effortless, personalized, and incredibly detailed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Intelligence</h3>
              <p className="text-gray-600 leading-relaxed">
                Our advanced AI analyzes thousands of data points to create personalized itineraries that match your unique travel style and preferences.
              </p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Time Optimization</h3>
              <p className="text-gray-600 leading-relaxed">
                Smart routing and timing suggestions ensure you make the most of every moment, with optimal travel times and activity scheduling.
              </p>
            </div>
            
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Local Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Discover hidden gems and local favorites with insider knowledge, from authentic restaurants to off-the-beaten-path attractions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Plan Your Trip in <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From dream destination to detailed itinerary in minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tell Us Your Dreams</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your destination, dates, budget, and interests. The more details, the better your personalized itinerary will be.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Works Its Magic</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes weather, local events, reviews, and your preferences to craft the perfect day-by-day itinerary.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Your Perfect Plan</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive a detailed, optimized itinerary with timings, locations, costs, and insider tips. Ready to explore!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Travelers Worldwide
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[{
              name: "Sarah & Mike",
              location: "Tokyo, Japan",
              bg: "bg-purple-100",
              iconColor: "text-purple-600",
              text: '"Travel Pal created the most amazing 10-day Japan itinerary for us. Every recommendation was spot-on, and we discovered places we never would have found on our own!"'
            },{
              name: "Emma Chen",
              location: "Paris, France",
              bg: "bg-green-100",
              iconColor: "text-green-600",
              text: '"As a solo traveler, I was nervous about planning my first European trip. Travel Pal made it so easy and gave me confidence with detailed day-by-day plans!"'
            },{
              name: "The Johnson Family",
              location: "Barcelona, Spain",
              bg: "bg-blue-100",
              iconColor: "text-blue-600",
              text: '"The AI understood our family\'s needs perfectly - kid-friendly activities, reasonable walking distances, and great restaurant recommendations. Our best family vacation ever!"'
            }].map((review, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{review.text}</p>
                <div className="flex items-center">
                  <div className={`w-10 h-10 ${review.bg} rounded-full flex items-center justify-center`}>
                    <Users className={`w-5 h-5 ${review.iconColor}`} />
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-600">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Adventure Plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade when you&apos;re ready for more features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  $0<span className="text-base font-normal">/month</span>
                </div>
                <ul className="text-gray-600 mb-6 space-y-3">
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Basic Itinerary Planner</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Up to 2 Trips per Month</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Community Support</li>
                </ul>
                <button className="bg-purple-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300">Get Started</button>
              </div>
            </div>
            {/* Pro Plan */}
            <div className="bg-purple-600 text-white border-2 border-purple-600 rounded-2xl p-8 relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-sm font-bold">Most Popular</div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-4">
                  $15<span className="text-base font-normal">/month</span>
                </div>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Unlimited Itineraries</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Priority AI Suggestions</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Offline PDF Export</li>
                </ul>
                <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300">Upgrade</button>
              </div>
            </div>
            {/* Premium Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  $30<span className="text-base font-normal">/month</span>
                </div>
                <ul className="text-gray-600 mb-6 space-y-3">
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Personalized Travel Concierge</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Exclusive Deals & Discounts</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> 24/7 Support</li>
                </ul>
                <button className="bg-purple-500 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300">Go Premium</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold text-xl mb-4">Travel Pal</h4>
            <p className="text-gray-400 text-sm">Plan your dream trip with AI-powered itineraries that are personalized, optimized, and stress-free.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Travel Pal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
