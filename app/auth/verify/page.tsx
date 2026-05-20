"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyFallback() {
  return (
    <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-[4px] shadow-sm p-10 text-center text-sm text-ud-dark/50">
        Verifying…
      </div>
    </div>
  );
}

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }

    signIn("magic-link", { token, redirect: false }).then((res) => {
      if (res?.error) {
        setStatus("error");
      } else {
        setStatus("success");
        setTimeout(() => router.push("/"), 2000);
      }
    });
  }, [token, router]);

  return (
    <div className="min-h-screen bg-ud-light-gray flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="bg-white rounded-[4px] shadow-sm p-10">
          {status === "loading" && (
            <>
              <Loader2 size={40} className="text-ud-burgundy animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-bold text-ud-dark">Verifying your link…</h2>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle2 size={40} className="text-ud-burgundy mx-auto mb-4" />
              <h2 className="text-lg font-bold text-ud-dark mb-2">You&apos;re signed in!</h2>
              <p className="text-sm text-ud-dark/55">Redirecting you now…</p>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle size={40} className="text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-ud-dark mb-2">Link expired or invalid</h2>
              <p className="text-sm text-ud-dark/55 mb-6">Magic links expire after 15 minutes. Request a new one below.</p>
              <button onClick={() => router.push("/auth/signin")}
                className="bg-ud-burgundy text-white text-sm font-bold px-6 py-3 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors">
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
