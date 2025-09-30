"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Users, Heart, Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const TRAVEL_STYLES = [
  { id: "ADVENTURE", label: "Adventure", icon: "🏔️" },
  { id: "CULTURAL", label: "Cultural", icon: "🏛️" },
  { id: "RELAXED", label: "Relaxed", icon: "🏖️" },
  { id: "FOODIE", label: "Foodie", icon: "🍜" },
  { id: "NIGHTLIFE", label: "Nightlife", icon: "🌃" },
  { id: "FAMILY", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { id: "ROMANTIC", label: "Romantic", icon: "💕" },
  { id: "BUSINESS", label: "Business", icon: "💼" },
  { id: "SOLO", label: "Solo", icon: "🎒" },
  { id: "BALANCED", label: "Balanced", icon: "⚖️" },
];

const INTERESTS = [
  "Museums",
  "Historical Sites",
  "Nature & Parks",
  "Food & Drink",
  "Shopping",
  "Nightlife",
  "Art & Culture",
  "Architecture",
  "Adventure Sports",
  "Beaches",
  "Photography",
  "Local Markets",
];

const BUDGET_RANGES = [
  { id: "ULTRA_BUDGET", label: "Ultra Budget", description: "< $50/day" },
  { id: "BUDGET", label: "Budget", description: "$50-100/day" },
  { id: "MID_RANGE", label: "Mid Range", description: "$100-200/day" },
  { id: "LUXURY", label: "Luxury", description: "$200-500/day" },
  { id: "ULTRA_LUXURY", label: "Ultra Luxury", description: "> $500/day" },
];

// ✅ Strongly typed form data
interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  budgetRange: string;
  groupSize: number;
  travelStyle: string;
  interests: string[];
  dietaryRequirements: string[];
  mobilityRequirements: string[];
}

export default function CreateTrip() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<TripFormData>({
    destination: "",
    startDate: "",
    endDate: "",
    budget: 1000,
    budgetRange: "MID_RANGE",
    groupSize: 1,
    travelStyle: "BALANCED",
    interests: [],
    dietaryRequirements: [],
    mobilityRequirements: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ Generic handler – no `any`
  function handleInputChange<K extends keyof TripFormData>(
    field: K,
    value: TripFormData[K]
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
    }
  }

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.destination.trim())
      newErrors.destination = "Destination is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }
    if (formData.interests.length === 0) {
      newErrors.interests = "Select at least one interest";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ send cookies/session automatically
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to the newly created itinerary
        router.push(`/itineraries/${data.id}`);
      } else if (response.status === 401) {
        // User is not authenticated
        setErrors({ submit: "You must be logged in to create an itinerary." });
        // Optionally redirect to login after a short delay
        setTimeout(() => router.push("/login"), 2000);
      } else {
        // Other server errors
        setErrors({ submit: data.error || "Failed to create itinerary" });
      }
    } catch {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plan Your Perfect Trip ✨
          </h1>
          <p className="text-xl text-gray-600">
            Tell us about your dream destination and we&apos;ll create a
            personalized itinerary just for you!
          </p>
        </div>

        <Card className="p-8 text-black">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Destination & Dates */}
            <div className="grid md:grid-cols-3 gap-6">
              <Input
                label="Where do you want to go?"
                placeholder="e.g. Tokyo, Japan"
                value={formData.destination}
                onChange={(e) =>
                  handleInputChange("destination", e.target.value)
                }
                error={errors.destination}
                icon={<MapPin className="w-5 h-5 text-gray-400" />}
              />

              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                error={errors.startDate}
                min={new Date().toISOString().split("T")[0]}
              />

              <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                error={errors.endDate}
                min={
                  formData.startDate || new Date().toISOString().split("T")[0]
                }
              />
            </div>

            {/* Budget & Group Size */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Budget: ${formData.budget}
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={formData.budget}
                  onChange={(e) =>
                    handleInputChange("budget", parseInt(e.target.value, 10))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>$100</span>
                  <span>$10,000+</span>
                </div>
              </div>

              <Input
                label="Group Size"
                type="number"
                min="1"
                max="20"
                value={formData.groupSize}
                onChange={(e) =>
                  handleInputChange("groupSize", parseInt(e.target.value, 10))
                }
                icon={<Users className="w-5 h-5 text-gray-400" />}
              />
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Budget Range per Day
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {BUDGET_RANGES.map((range) => (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => handleInputChange("budgetRange", range.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      formData.budgetRange === range.id
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-sm">{range.label}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {range.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Travel Style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {TRAVEL_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => handleInputChange("travelStyle", style.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      formData.travelStyle === style.id
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{style.icon}</div>
                    <div className="font-medium text-sm">{style.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                What interests you? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      formData.interests.includes(interest)
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-sm">{interest}</div>
                  </button>
                ))}
              </div>
              {errors.interests && (
                <p className="text-sm text-red-600 mt-2">{errors.interests}</p>
              )}
            </div>

            {/* Error Display */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="px-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Your Itinerary...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Create My Dream Trip
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
