-- CreateEnum
CREATE TYPE "public"."BudgetRange" AS ENUM ('ULTRA_BUDGET', 'BUDGET', 'MID_RANGE', 'LUXURY', 'ULTRA_LUXURY');

-- CreateEnum
CREATE TYPE "public"."TravelStyle" AS ENUM ('ADVENTURE', 'CULTURAL', 'RELAXED', 'FOODIE', 'NIGHTLIFE', 'FAMILY', 'ROMANTIC', 'BUSINESS', 'SOLO', 'BALANCED');

-- CreateEnum
CREATE TYPE "public"."ActivityCategory" AS ENUM ('SIGHTSEEING', 'RESTAURANT', 'ENTERTAINMENT', 'SHOPPING', 'TRANSPORTATION', 'ACCOMMODATION', 'ACTIVITY', 'MUSEUM', 'PARK', 'BEACH', 'NIGHTLIFE', 'CULTURAL', 'ADVENTURE', 'WELLNESS', 'BUSINESS', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ItineraryStatus" AS ENUM ('DRAFT', 'GENERATING', 'COMPLETED', 'SHARED', 'ARCHIVED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."FeedbackCategory" AS ENUM ('ITINERARY_QUALITY', 'USER_EXPERIENCE', 'BUG_REPORT', 'FEATURE_REQUEST', 'GENERAL');

-- CreateEnum
CREATE TYPE "public"."PlanType" AS ENUM ('FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'UNPAID', 'TRIALING');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."user_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "preferredBudget" "public"."BudgetRange" NOT NULL DEFAULT 'MID_RANGE',
    "travelStyle" "public"."TravelStyle" NOT NULL DEFAULT 'BALANCED',
    "interests" TEXT[],
    "dietaryRequirements" TEXT[],
    "mobilityRequirements" TEXT[],
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."itineraries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "coordinates" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "budget" DOUBLE PRECISION,
    "budgetRange" "public"."BudgetRange" NOT NULL DEFAULT 'MID_RANGE',
    "groupSize" INTEGER NOT NULL DEFAULT 1,
    "travelStyle" "public"."TravelStyle" NOT NULL DEFAULT 'BALANCED',
    "interests" TEXT[],
    "aiPrompt" TEXT,
    "aiModel" TEXT DEFAULT 'gemini-pro',
    "generationTime" INTEGER,
    "summary" TEXT,
    "highlights" TEXT[],
    "estimatedCost" DOUBLE PRECISION,
    "status" "public"."ItineraryStatus" NOT NULL DEFAULT 'DRAFT',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itineraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."itinerary_days" (
    "id" TEXT NOT NULL,
    "itinerary_id" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "summary" TEXT,
    "estimatedCost" DOUBLE PRECISION,
    "weather" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itinerary_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activities" (
    "id" TEXT NOT NULL,
    "day_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "public"."ActivityCategory" NOT NULL,
    "location" TEXT,
    "coordinates" TEXT,
    "placeId" TEXT,
    "startTime" TEXT,
    "endTime" TEXT,
    "duration" INTEGER,
    "order" INTEGER NOT NULL,
    "estimatedCost" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "bookingUrl" TEXT,
    "bookingRequired" BOOLEAN NOT NULL DEFAULT false,
    "tips" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."feedback" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "itinerary_id" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "category" "public"."FeedbackCategory" NOT NULL,
    "aiQuality" INTEGER,
    "usability" INTEGER,
    "accuracy" INTEGER,
    "improvements" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "planType" "public"."PlanType" NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "itinerariesUsed" INTEGER NOT NULL DEFAULT 0,
    "itinerariesLimit" INTEGER NOT NULL DEFAULT 5,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cached_locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "placeId" TEXT,
    "coordinates" TEXT,
    "placesData" JSONB,
    "weatherData" JSONB,
    "popularTimes" JSONB,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "hitCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "cached_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_usage" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "model" TEXT NOT NULL,
    "promptTokens" INTEGER,
    "responseTokens" INTEGER,
    "totalTokens" INTEGER,
    "cost" DOUBLE PRECISION,
    "endpoint" TEXT,
    "responseTime" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "public"."accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "public"."sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "public"."verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "public"."verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "public"."user_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "itineraries_shareToken_key" ON "public"."itineraries"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "itinerary_days_itinerary_id_dayNumber_key" ON "public"."itinerary_days"("itinerary_id", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_customer_id_key" ON "public"."subscriptions"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "public"."subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "cached_locations_placeId_key" ON "public"."cached_locations"("placeId");

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itineraries" ADD CONSTRAINT "itineraries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."itinerary_days" ADD CONSTRAINT "itinerary_days_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "public"."itinerary_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
