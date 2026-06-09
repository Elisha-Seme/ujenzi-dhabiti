import Link from "next/link";
import { FileText, ArrowRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { db, quotes } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";

const STATUS_CONFIG = {
  pending: { label: "Awaiting Response", icon: Clock, cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  responded: { label: "Quote Sent", icon: CheckCircle, cls: "bg-green-50 text-green-700 border border-green-200" },
  declined: { label: "Declined", icon: AlertCircle, cls: "bg-red-50 text-red-600 border border-red-200" },
};

export default async function AccountQuotesPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userQuotes = await db
    .select()
    .from(quotes)
    .where(eq(quotes.userId, session.user.id))
    .orderBy(desc(quotes.submittedAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ud-dark">My Quotes</h1>
          <p className="text-sm text-ud-dark/50 mt-1">Track all your project quote requests.</p>
        </div>
        <Link
          href="/request-a-quote"
          className="inline-flex items-center gap-2 bg-ud-burgundy text-white text-sm font-bold px-4 py-2.5 rounded-[4px] hover:bg-ud-burgundy-hover transition-colors"
        >
          <FileText className="w-4 h-4" /> New Quote
        </Link>
      </div>

      {userQuotes.length === 0 ? (
        <div className="bg-white rounded-[4px] shadow-sm p-12 text-center">
          <FileText className="w-10 h-10 text-ud-dark/30 mx-auto mb-3" />
          <p className="font-semibold text-ud-dark/50">No quotes yet</p>
          <p className="text-sm text-ud-dark/40 mt-1 mb-5">Submit a quote request to get started.</p>
          <Link
            href="/request-a-quote"
            className="inline-flex items-center gap-2 bg-ud-burgundy text-white px-5 py-2.5 rounded text-sm font-semibold"
          >
            Request a Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userQuotes.map((q) => {
            const cfg = STATUS_CONFIG[q.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={q.id} className="bg-white rounded-[4px] shadow-sm overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-11 h-11 rounded-[4px] bg-ud-burgundy/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-ud-burgundy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-ud-dark">{q.id}</span>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.cls}`}>
                        <StatusIcon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-ud-dark mb-0.5">{q.projectType}</p>
                    <p className="text-xs text-ud-dark/50 mb-2">{q.description}</p>
                    <p className="text-xs text-ud-dark/40">
                      Submitted: {new Date(q.submittedAt).toLocaleDateString("en-KE")}
                      {q.respondedAt && ` · Responded: ${new Date(q.respondedAt).toLocaleDateString("en-KE")}`}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {q.status === "responded" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-[4px]">
                        <CheckCircle className="w-3.5 h-3.5" /> View Quote
                      </span>
                    )}
                    {q.status === "pending" && (
                      <span className="text-xs text-ud-dark/40 italic">We&apos;ll be in touch</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
