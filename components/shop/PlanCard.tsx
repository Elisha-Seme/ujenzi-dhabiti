import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Layers, Maximize, ArrowRight } from "lucide-react";
import { HousePlan } from "@/lib/house-plans";

export default function PlanCard({ plan }: { plan: HousePlan }) {
  return (
    <Link
      href={`/shop/plans/${plan.id}`}
      className="group bg-white border border-ud-dark/8 rounded-[4px] overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <Image src={plan.image} alt={plan.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <div className="absolute inset-0 bg-ud-dark/20" />
        <span className="absolute top-3 left-3 bg-ud-dark/70 text-white text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-[4px]">
          {plan.category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-ud-dark mb-1 leading-snug">{plan.name}</h3>
        <p className="text-xs text-ud-dark/55 leading-relaxed mb-3 line-clamp-2">{plan.description}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4 text-xs text-ud-dark/60">
          {plan.bedrooms !== undefined && (
            <span className="inline-flex items-center gap-1"><BedDouble size={13} className="text-ud-burgundy" />{plan.bedrooms} Bed</span>
          )}
          {plan.bathrooms !== undefined && (
            <span className="inline-flex items-center gap-1"><Bath size={13} className="text-ud-burgundy" />{plan.bathrooms} Bath</span>
          )}
          <span className="inline-flex items-center gap-1"><Layers size={13} className="text-ud-burgundy" />{plan.floors} {plan.floors === 1 ? "Floor" : "Floors"}</span>
          <span className="inline-flex items-center gap-1"><Maximize size={13} className="text-ud-burgundy" />{plan.plinthAreaSqM} m²</span>
        </div>

        <div className="flex items-end justify-between mt-auto pt-3 border-t border-ud-dark/8">
          <div>
            <div className="text-[11px] text-ud-dark/40">From (digital)</div>
            <div className="text-lg font-bold text-ud-dark">KES {plan.priceDigitalKES.toLocaleString()}</div>
            <div className="text-[11px] text-ud-dark/45">Print KES {plan.pricePrintKES.toLocaleString()}</div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-ud-burgundy text-white text-xs font-bold px-4 py-2.5 rounded-[4px] group-hover:bg-ud-burgundy-hover transition-colors">
            View Plan <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
