"use client";

import { Suspense } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInContent />
    </Suspense>
  );
}

function SignInFallback() {
  return (
    <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm bg-white rounded-[4px] shadow-sm p-8 text-center text-sm text-ud-dark/50">
        Loading sign in…
      </div>
    </div>
  );
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [mode, setMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email, password, redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setMagicSent(true);
      } else {
        setError("Failed to send magic link. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo variant="light" layout="stacked" className="h-16 w-auto" />
        </div>

        <div className="bg-white rounded-[4px] shadow-sm p-8">
          <h1 className="text-xl font-bold text-ud-dark mb-1">Sign in</h1>
          <p className="text-sm text-ud-dark/50 mb-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-ud-burgundy font-semibold hover:underline">Sign up</Link>
          </p>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("password")}
              className={`flex-1 py-2 text-xs font-semibold rounded-[4px] border transition-colors ${mode === "password" ? "bg-ud-burgundy text-white border-ud-burgundy" : "border-ud-dark/20 text-ud-dark/60 hover:border-ud-burgundy"}`}
            >
              Password
            </button>
            <button
              onClick={() => setMode("magic")}
              className={`flex-1 py-2 text-xs font-semibold rounded-[4px] border transition-colors ${mode === "magic" ? "bg-ud-burgundy text-white border-ud-burgundy" : "border-ud-dark/20 text-ud-dark/60 hover:border-ud-burgundy"}`}
            >
              Magic link
            </button>
          </div>

          {error && (
            <div className="bg-ud-burgundy/5 border border-ud-burgundy/30 text-ud-burgundy text-sm px-4 py-3 rounded-[4px] mb-5">
              {error}
            </div>
          )}

          {mode === "password" ? (
            <form onSubmit={handlePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ud-burgundy/70" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2.5 text-sm text-ud-dark border border-ud-dark/30 rounded-[4px] placeholder:text-ud-dark/40 focus:outline-none focus:border-ud-burgundy focus:ring-1 focus:ring-ud-burgundy transition-colors" />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-ud-dark/60 uppercase tracking-wider">Password</label>
                  <button type="button" onClick={() => setMode("magic")} className="text-xs text-ud-burgundy hover:underline">Sign in with link instead</button>
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ud-burgundy/70" />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 text-sm text-ud-dark border border-ud-dark/30 rounded-[4px] placeholder:text-ud-dark/40 focus:outline-none focus:border-ud-burgundy focus:ring-1 focus:ring-ud-burgundy transition-colors" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-ud-burgundy text-white text-sm font-bold py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors disabled:opacity-60">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={14} /></>}
              </button>
            </form>
          ) : magicSent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-ud-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={22} className="text-ud-burgundy" />
              </div>
              <h3 className="font-bold text-ud-dark mb-2">Check your email</h3>
              <p className="text-sm text-ud-dark/55">We sent a sign-in link to <strong>{email}</strong>. It expires in 15 minutes.</p>
              <button onClick={() => setMagicSent(false)} className="mt-4 text-xs text-ud-burgundy hover:underline">Send again</button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <p className="text-sm text-ud-dark/60">Enter your email and we&apos;ll send you a sign-in link — no password needed.</p>
              <div>
                <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ud-burgundy/70" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-2.5 text-sm text-ud-dark border border-ud-dark/30 rounded-[4px] placeholder:text-ud-dark/40 focus:outline-none focus:border-ud-burgundy focus:ring-1 focus:ring-ud-burgundy transition-colors" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-ud-burgundy text-white text-sm font-bold py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors disabled:opacity-60">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Send Magic Link</span><ArrowRight size={14} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
