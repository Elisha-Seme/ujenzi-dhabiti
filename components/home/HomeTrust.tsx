import Image from "next/image";
import { and, asc, eq } from "drizzle-orm";
import { db, trustItems } from "@/lib/db";

export default async function HomeTrust() {
  let items: (typeof trustItems.$inferSelect)[] = [];
  try {
    items = await db.select().from(trustItems).where(and(eq(trustItems.published, true), eq(trustItems.permissionConfirmed, true))).orderBy(asc(trustItems.sortOrder));
  } catch {
    return null;
  }
  if (!items.length) return null;
  return (
    <section className="bg-white py-16">
      <div className="max-w-content mx-auto px-6">
        <h2 className="text-2xl font-bold text-ud-dark text-center">Trusted to Build Well</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {items.map((item) => (
            <article key={item.id} className="border border-ud-dark/10 rounded-[4px] p-5">
              {item.image && <Image src={item.image} alt={item.title} width={120} height={60} className="h-12 w-auto object-contain mb-4" />}
              <h3 className="font-bold text-ud-dark">{item.title}</h3>
              {item.subtitle && <p className="text-xs text-ud-dark/45">{item.subtitle}</p>}
              {item.body && <p className="mt-3 text-sm text-ud-dark/65">{item.body}</p>}
              {item.linkUrl && <a href={item.linkUrl} className="mt-3 inline-block text-xs font-semibold text-ud-burgundy">View evidence →</a>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
