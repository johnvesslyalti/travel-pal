// ==================================================
// FILE: app/page.tsx
// Main landing page with client-side session check
// ==================================================
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  ArrowRight,
  Menu,
  X
} from "lucide-react";

// Custom hook to fetch session from API route
function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setSession(data?.user ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { session, loading };
}

export default function LandingPage() {
  const { session, loading } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Redirect if logged in
  useEffect(() => {
    if (!loading && session) {
      router.push("/dashboard");
    }
  }, [session, loading, router]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return null; // Optional: show loader

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"
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
              <Link href="/auth/signin">
                <button className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                  Sign In
                </button>
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
              <Link
                href="/auth/signin"
                className="block text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Sign In
              </Link>
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
        {/* ...rest of your hero, features, how-it-works, social proof, pricing, footer JSX */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-white text-5xl md:text-7xl font-bold">
            Your Perfect Trip,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Planned in Seconds
            </span>
          </h1>
          <p className="text-white/90 mt-6 text-xl md:text-2xl">
            Transform your travel dreams into detailed itineraries with AI.
          </p>
          <div className="mt-8 flex gap-4">
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
        </div>
      </section>

      {/* You can copy-paste all remaining sections here (Features, How It Works, Social Proof, Pricing, Footer) */}
    </div>
  );
}
