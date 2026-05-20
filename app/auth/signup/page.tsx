"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Sign up failed. Please try again.");
      setLoading(false);
      return;
    }

    // Auto sign in after signup
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo variant="light" className="h-12 w-auto" />
        </div>

        <div className="bg-white rounded-[4px] shadow-sm p-8">
          <h1 className="text-xl font-bold text-ud-dark mb-1">Create an account</h1>
          <p className="text-sm text-ud-dark/50 mb-6">
            Already have one?{" "}
            <Link href="/auth/signin" className="text-ud-burgundy font-semibold hover:underline">Sign in</Link>
          </p>

          {error && (
            <div className="bg-ud-burgundy/5 border border-ud-burgundy/30 text-ud-burgundy text-sm px-4 py-3 rounded-[4px] mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Full Name", placeholder: "John Doe", icon: <User size={14} />, type: "text" },
              { key: "email", label: "Email", placeholder: "you@example.com", icon: <Mail size={14} />, type: "email" },
              { key: "phone", label: "Phone (optional)", placeholder: "+254...", icon: <Phone size={14} />, type: "tel" },
              { key: "password", label: "Password", placeholder: "Min. 8 characters", icon: <Lock size={14} />, type: "password" },
              { key: "confirm", label: "Confirm Password", placeholder: "Repeat password", icon: <Lock size={14} />, type: "password" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ud-burgundy/70">{f.icon}</span>
                  <input
                    type={f.type}
                    required={f.key !== "phone"}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full pl-9 pr-4 py-2.5 text-sm text-ud-dark border border-ud-dark/30 rounded-[4px] placeholder:text-ud-dark/40 focus:outline-none focus:border-ud-burgundy focus:ring-1 focus:ring-ud-burgundy transition-colors"
                  />
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-ud-burgundy text-white text-sm font-bold py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors disabled:opacity-60 mt-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Create Account</span><ArrowRight size={14} /></>}
            </button>

            <p className="text-xs text-ud-dark/50 text-center">
              By signing up you agree to our{" "}
              <Link href="/terms" className="text-ud-burgundy hover:underline">Terms of Service</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
