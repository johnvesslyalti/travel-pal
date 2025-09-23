# 🗺️ Smart Itinerary Optimizer

> AI-powered travel planning SaaS that creates personalized, optimized itineraries for any destination

## 🌟 Overview

Smart Itinerary Optimizer is a Next.js-based SaaS platform that leverages AI to automatically generate personalized travel itineraries. Users input their destination, preferences, and constraints, and our system creates detailed day-by-day plans optimized for time, budget, and interests.

## ✨ Features

### MVP Features
- 🤖 **AI-Powered Itinerary Generation** - Using Google Gemini API
- 📍 **Destination Planning** - Support for global destinations
- ⏰ **Time Optimization** - Efficient route planning and scheduling
- 💰 **Budget-Aware Recommendations** - Suggestions within user's budget range
- 🎯 **Interest-Based Matching** - Customized activities based on user preferences
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 💾 **Itinerary Saving** - Save and revisit your travel plans

### Planned Features (Future Releases)
- 🌡️ **Weather Integration** - Real-time weather-based adjustments
- 🎫 **Booking Integration** - Direct hotel/activity booking
- 👥 **Group Planning** - Collaborative itinerary creation
- 📊 **Analytics Dashboard** - Travel insights and statistics
- 🌍 **Multi-language Support** - Global accessibility
- 📲 **Mobile App** - Native iOS/Android applications

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **AI Integration:** Google Gemini API
- **Authentication:** NextAuth.js
- **Deployment:** Vercel
- **Additional APIs:**
  - Google Places API (location data)
  - OpenWeatherMap API (weather data)
  - REST Countries API (country information)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database (or use SQLite for local development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/smart-itinerary-optimizer.git
cd smart-itinerary-optimizer
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/travel_saas"

# Google Gemini AI API
GOOGLE_AI_API_KEY="your_google_ai_api_key"

# Google Places API
GOOGLE_PLACES_API_KEY="your_google_places_api_key"

# OpenWeatherMap API
OPENWEATHER_API_KEY="your_openweather_api_key"

# NextAuth
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npm run db:seed
```

5. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
smart-itinerary-optimizer/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── itinerary/         # Itinerary pages
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── ui/               # UI components (buttons, forms, etc.)
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility functions and configurations
│   ├── ai/               # AI service integrations
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database connection
│   └── utils.ts          # General utilities
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── public/               # Static assets
├── types/                # TypeScript type definitions
└── README.md
```

## 🔑 API Keys Setup

### 1. Google Gemini AI API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env.local` as `GOOGLE_AI_API_KEY`

### 2. Google Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Places API
3. Create credentials (API Key)
4. Add to `.env.local` as `GOOGLE_PLACES_API_KEY`

### 3. OpenWeatherMap API
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add to `.env.local` as `OPENWEATHER_API_KEY`

## 📊 Database Schema

```sql
User
- id: String (Primary Key)
- email: String (Unique)
- name: String
- createdAt: DateTime
- updatedAt: DateTime

Itinerary
- id: String (Primary Key)
- userId: String (Foreign Key)
- destination: String
- startDate: DateTime
- endDate: DateTime
- budget: Float
- preferences: Json
- generatedPlan: Json
- createdAt: DateTime
- updatedAt: DateTime
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Roadmap

- [ ] **Phase 1:** MVP with basic itinerary generation
- [ ] **Phase 2:** User authentication and saved itineraries
- [ ] **Phase 3:** Advanced AI features and real-time data
- [ ] **Phase 4:** Booking integrations and monetization
- [ ] **Phase 5:** Mobile app and advanced analytics

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- 📧 Email: altijohnvessly@gmail.com
- 💬 Discord: [Join our community](https://discord.gg/your-server)
- 🐛 Issues: [GitHub Issues](https://github.com/johnvesslyalti/travel-pal/issues)

## 🙏 Acknowledgments

- Google Gemini AI for powering our itinerary generation
- Next.js team for the amazing framework
- Vercel for seamless deployment
- Open source community for various packages and tools

---

**Made with ❤️ for travelers worldwide**