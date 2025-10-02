// ==================================================
// FILE: app/page.tsx
// Landing page with direct social login
// ==================================================
"use client";

import React, { useState, useEffect } from "react";
import { Play, Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { FaGoogle } from "react-icons/fa";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  // Scroll effect for nav
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
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

            {/* Desktop Nav - only product links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Pricing
              </a>
            </div>

            {/* Mobile Menu Button */}
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
              <a
                href="#features"
                className="block text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="block text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Pricing
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-white text-5xl md:text-7xl font-bold">
            Your Perfect Trip,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Planned in Seconds
            </span>
          </h1>
          <p className="text-white/90 mt-6 text-xl md:text-2xl">
            Transform your travel dreams into detailed itineraries with AI.
          </p>

          {/* Direct Social Login Buttons */}
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            <button
              onClick={() => handleLogin()}
              className="flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              <FaGoogle className="w-5 h-5" />
              Continue with Google
            </button>
          </div>

          {/* Optional Demo Button */}
          <button className="mt-4 md:mt-0 md:ml-4 flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20">
            <Play className="w-5 h-5" />
            Watch Demo
          </button>
        </div>

        {/* Hero Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 rounded-full opacity-40 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-400 rounded-full opacity-40 blur-3xl animate-pulse"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold mb-2">
                AI-Powered Itineraries
              </h3>
              <p className="text-gray-600">
                Plan your trips in seconds with AI-generated detailed
                itineraries.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold mb-2">
                Custom Recommendations
              </h3>
              <p className="text-gray-600">
                Get suggestions for activities, hotels, and local experiences
                tailored for you.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl shadow hover:shadow-lg transition-all">
              <h3 className="text-xl font-semibold mb-2">Seamless Booking</h3>
              <p className="text-gray-600">
                Book flights, hotels, and activities directly from our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                1. Choose Destination
              </h3>
              <p className="text-gray-600">
                Select your desired city or country to start planning.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                2. AI Generates Plan
              </h3>
              <p className="text-gray-600">
                Our AI creates a personalized travel plan within seconds.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">3. Enjoy Trip</h3>
              <p className="text-gray-600">
                Follow your plan, explore, and have a seamless travel
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition-all text-center">
              <h3 className="text-xl font-semibold mb-4">Free</h3>
              <p className="text-gray-600 mb-4">
                Basic AI itineraries for casual travelers.
              </p>
              <span className="text-3xl font-bold mb-4 block">$0</span>
            </div>
            <div className="p-8 bg-purple-600 text-white rounded-2xl shadow-lg text-center transform scale-105">
              <h3 className="text-xl font-semibold mb-4">Pro</h3>
              <p className="mb-4">
                Advanced itineraries, recommendations, and booking options.
              </p>
              <span className="text-3xl font-bold mb-4 block">$19/mo</span>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition-all text-center">
              <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
              <p className="text-gray-600 mb-4">
                Tailored travel planning solutions for businesses.
              </p>
              <span className="text-3xl font-bold mb-4 block">Contact Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-bold text-xl">Travel Pal</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-purple-500 transition-colors">
              About
            </a>
            <a href="#" className="hover:text-purple-500 transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-purple-500 transition-colors">
              Privacy
            </a>
          </div>
          <span>
            © {new Date().getFullYear()} Travel Pal. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
