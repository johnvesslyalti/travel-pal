"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await authClient.signIn.magicLink({
        email,
        callbackURL: "/dashboard", // redirect after login
      });

      setMessage("Magic link sent! Check your email.");
    } catch (err: any) {
      console.error("Magic link error:", err);
      setMessage("Failed to send magic link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign Up with Magic Link</h1>
      <form onSubmit={handleMagicLink} className="flex flex-col gap-3 w-80">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
