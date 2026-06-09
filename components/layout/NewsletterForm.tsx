"use client";

import { useState } from "react";
import { Send, Check, Loader2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="flex items-center gap-2 text-sm text-white/70">
        <Check className="w-4 h-4 text-ud-burgundy" /> Thanks — you&apos;re subscribed.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-[4px] px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-ud-burgundy"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        aria-label="Subscribe"
        className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 bg-ud-burgundy text-white text-sm font-semibold px-4 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors disabled:opacity-60"
      >
        {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </button>
    </form>
  );
}
