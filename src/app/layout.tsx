import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Travel Pal - AI-Powered Travel Planning',
  description: 'Create perfect travel itineraries with AI. Personalized recommendations, budget optimization, and seamless planning.',
  keywords: 'travel, itinerary, AI, vacation planning, trip planner, travel guide',
  authors: [{ name: 'Travel Pal Team' }],
  openGraph: {
    title: 'Travel Pal - AI-Powered Travel Planning',
    description: 'Create perfect travel itineraries with AI. Personalized recommendations, budget optimization, and seamless planning.',
    url: 'https://travelpal.ai',
    siteName: 'Travel Pal',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Travel Pal - AI-Powered Travel Planning'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Pal - AI-Powered Travel Planning',
    description: 'Create perfect travel itineraries with AI. Personalized recommendations, budget optimization, and seamless planning.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}