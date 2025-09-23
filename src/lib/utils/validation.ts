import { z } from 'zod'

export const createItinerarySchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  budget: z.number().min(1, 'Budget must be greater than 0'),
  budgetRange: z.enum(['ULTRA_BUDGET', 'BUDGET', 'MID_RANGE', 'LUXURY', 'ULTRA_LUXURY']),
  groupSize: z.number().min(1, 'Group size must be at least 1'),
  travelStyle: z.enum(['ADVENTURE', 'CULTURAL', 'RELAXED', 'FOODIE', 'NIGHTLIFE', 'FAMILY', 'ROMANTIC', 'BUSINESS', 'SOLO', 'BALANCED']),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  dietaryRequirements: z.array(z.string()).optional(),
  mobilityRequirements: z.array(z.string()).optional(),
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate']
})

export const updateItinerarySchema = z.object({
  title: z.string().min(1).optional(),
  status: z.enum(['DRAFT', 'GENERATING', 'COMPLETED', 'SHARED', 'ARCHIVED', 'FAILED']).optional(),
  isPublic: z.boolean().optional(),
})

export const feedbackSchema = z.object({
  itineraryId: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  category: z.enum(['ITINERARY_QUALITY', 'USER_EXPERIENCE', 'BUG_REPORT', 'FEATURE_REQUEST', 'GENERAL']),
  aiQuality: z.number().min(1).max(5).optional(),
  usability: z.number().min(1).max(5).optional(),
  accuracy: z.number().min(1).max(5).optional(),
  improvements: z.array(z.string()).optional(),
})