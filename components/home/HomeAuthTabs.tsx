"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Mail, Lock, User, Phone, ArrowRight, Loader2, UserCircle2 } from "lucide-react";

type Tab = "signin" | "register";

export default function HomeAuthTabs() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [signinForm, setSigninForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { ...signinForm, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerForm),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Sign up failed. Please try again.");
      setLoading(false);
      return;
    }
    await signIn("credentials", {
      email: registerForm.email,
      password: registerForm.password,
      redirect: false,
    });
    setLoading(false);
    router.refresh();
  };

  const inputClass =
    "w-full pl-9 pr-4 py-2.5 text-sm text-ud-dark border border-ud-dark/25 rounded-[4px] placeholder:text-ud-dark/40 focus:outline-none focus:border-ud-burgundy focus:ring-1 focus:ring-ud-burgundy transition-colors";

  // Signed-in state
  if (status === "authenticated" && session?.user) {
    const firstName = session.user.name?.split(" ")[0] ?? "there";
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-[4px] shadow-lg p-7 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full bg-ud-burgundy/10 flex items-center justify-center">
            <UserCircle2 className="w-6 h-6 text-ud-burgundy" />
          </div>
          <div>
            <p className="text-xs text-ud-dark/50">Welcome back,</p>
            <p className="text-sm font-bold text-ud-dark">{firstName}</p>
          </div>
        </div>
        <div className="space-y-2.5">
          <Link href="/shop" className="block w-full text-center bg-ud-burgundy text-white text-sm font-bold py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
            Go to Shop
          </Link>
          <Link href="/account/orders" className="block w-full text-center border border-ud-dark/20 text-ud-dark text-sm font-semibold py-3 rounded-[4px] hover:border-ud-burgundy hover:text-ud-burgundy transition-colors">
            My Orders
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full text-xs text-ud-dark/50 hover:text-ud-burgundy transition-colors pt-1">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[4px] shadow-lg w-full max-w-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex">
        {(["signin", "register"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(""); }}
            className={`flex-1 py-3.5 text-sm font-bold transition-colors ${
              tab === t ? "bg-white text-ud-burgundy border-b-2 border-ud-burgundy" : "bg-ud-light-gray text-ud-dark/50 hover:text-ud-dark border-b-2 border-transparent"
            }`}
          >
            {t === "signin" ? "Sign In" : "Register"}
          </button>
        ))}
      </div>

      <div className="p-7">
        {error && (
          <div className="bg-ud-burgundy/5 border border-ud-burgundy/30 text-ud-burgundy text-xs px-3 py-2.5 rounded-[4px] mb-4">{error}</div>
        )}

        {tab === "signin" ? (
          <form onSubmit={handleSignin} className="space-y-4">
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ud-burgundy/70" />
              <input type="email" required placeholder="you@example.com" value={signinForm.email}
                onChange={(e) => setSigninForm((p) => ({ ...p, email: e.target.value }))} className={inputClass} />
            </div>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ud-burgundy/70" />
              <input type="password" required placeholder="Password" value={signinForm.password}
                onChange={(e) => setSigninForm((p) => ({ ...p, password: e.target.value }))} className={inputClass} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-ud-burgundy text-white text-sm font-bold py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={14} /></>}
            </button>
            <p className="text-xs text-ud-dark/50 text-center">
              Prefer a magic link?{" "}
              <Link href="/auth/signin" className="text-ud-burgundy font-semibold hover:underline">Use email link</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ud-burgundy/70" />
              <input type="text" required placeholder="Full name" value={registerForm.name}
                onChange={(e) => setRegisterForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
            </div>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ud-burgundy/70" />
              <input type="email" required placeholder="you@example.com" value={registerForm.email}
                onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))} className={inputClass} />
            </div>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ud-burgundy/70" />
              <input type="tel" placeholder="Phone (optional)" value={registerForm.phone}
                onChange={(e) => setRegisterForm((p) => ({ ...p, phone: e.target.value }))} className={inputClass} />
            </div>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ud-burgundy/70" />
              <input type="password" required placeholder="Password (min. 8 characters)" value={registerForm.password}
                onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))} className={inputClass} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-ud-burgundy text-white text-sm font-bold py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Create Account</span><ArrowRight size={14} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
