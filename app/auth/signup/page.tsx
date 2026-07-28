"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/layout/Logo";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const toggleVisible = (k: string) => setVisible((p) => ({ ...p, [k]: !p[k] }));

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
          <Logo variant="light" layout="stacked" className="h-16 w-auto" />
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

          <GoogleAuthButton />
          {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && (
            <div className="flex items-center gap-3 my-5" aria-hidden>
              <span className="h-px flex-1 bg-ud-dark/10" />
              <span className="text-[11px] uppercase tracking-wider text-ud-dark/35">or use email</span>
              <span className="h-px flex-1 bg-ud-dark/10" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Full Name", placeholder: "John Doe", icon: <User size={14} />, type: "text" },
              { key: "email", label: "Email", placeholder: "you@example.com", icon: <Mail size={14} />, type: "email" },
              { key: "phone", label: "Phone (optional)", placeholder: "+254...", icon: <Phone size={14} />, type: "tel" },
              { key: "password", label: "Password", placeholder: "Min. 8 characters", icon: <Lock size={14} />, type: "password" },
              { key: "confirm", label: "Confirm Password", placeholder: "Repeat password", icon: <Lock size={14} />, type: "password" },
            ].map((f) => {
              const isPassword = f.type === "password";
              const shown = !!visible[f.key];
              return (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-ud-dark/60 uppercase tracking-wider mb-1.5">{f.label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ud-burgundy/70">{f.icon}</span>
                    <input
                      type={isPassword ? (shown ? "text" : "password") : f.type}
                      required={f.key !== "phone"}
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      autoComplete={f.key === "confirm" ? "new-password" : f.key === "password" ? "new-password" : undefined}
                      className={`w-full pl-9 ${isPassword ? "pr-10" : "pr-4"} py-2.5 text-sm text-ud-dark border border-ud-dark/30 rounded-[4px] placeholder:text-ud-dark/40 focus:outline-none focus:border-ud-burgundy focus:ring-1 focus:ring-ud-burgundy transition-colors`}
                    />
                    {isPassword && (
                      <button
                        type="button"
                        onClick={() => toggleVisible(f.key)}
                        aria-label={shown ? "Hide password" : "Show password"}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ud-dark/40 hover:text-ud-dark transition-colors p-1"
                      >
                        {shown ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

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
