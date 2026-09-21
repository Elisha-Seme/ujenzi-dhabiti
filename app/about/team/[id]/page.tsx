import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import SectionHero from "@/components/ui/SectionHero";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function TeamMemberPage({ params }: { params: { id: string } }) {
  let member: typeof teamMembers.$inferSelect | undefined;
  try {
    [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, params.id)).limit(1);
  } catch (error) {
    console.error("Team member profile load failed:", error);
    return notFound();
  }
  if (!member) return notFound();

  return (
    <>
      <SectionHero title={member.name} subtitle={member.title} />
      <section className="bg-ud-light-gray py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/about" className="inline-flex items-center gap-2 text-sm text-ud-dark/55 hover:text-ud-burgundy transition-colors mb-8">
            <ArrowLeft size={15} /> Back to About
          </Link>
          <div className="bg-white rounded-[4px] border border-ud-dark/10 shadow-sm overflow-hidden grid md:grid-cols-[280px_1fr]">
            <div className="relative min-h-[280px] bg-ud-burgundy/5">
              {member.image ? (
                <Image src={member.image} alt={member.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 280px" />
              ) : (
                <div className="w-full h-full min-h-[280px] flex items-center justify-center text-7xl font-bold text-ud-burgundy">{member.name.charAt(0)}</div>
              )}
            </div>
            <div className="p-7 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-ud-burgundy mb-3">{member.title}</p>
              <h1 className="text-3xl font-bold text-ud-dark mb-5">{member.name}</h1>
              {member.bio ? <p className="text-sm text-ud-dark/70 leading-relaxed mb-8">{member.bio}</p> : <p className="text-sm text-ud-dark/50 leading-relaxed mb-8">Profile information is being updated.</p>}
              {member.competences.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-ud-dark/50 mb-3">Key competences</h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {member.competences.map((competence) => (
                      <li key={competence} className="flex items-start gap-2 text-sm text-ud-dark/70">
                        <CheckCircle2 size={16} className="text-ud-burgundy flex-shrink-0 mt-0.5" />
                        {competence}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
