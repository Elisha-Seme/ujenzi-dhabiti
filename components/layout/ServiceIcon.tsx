import { Grid, Hammer, HardHat, Layers, Layout, PaintBucket, PencilRuler, Pipette, Wrench, type LucideIcon } from "lucide-react";

// Explicit map instead of `import * as LucideIcons`, so client bundles only
// carry the icons services actually use. Unknown names fall back to Layers.
const ICONS: Record<string, LucideIcon> = { Grid, Hammer, HardHat, Layers, Layout, PaintBucket, PencilRuler, Pipette, Wrench };

export default function ServiceIcon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
  const Icon = ICONS[name] ?? Layers;
  return <Icon size={size} strokeWidth={1.75} className={className} aria-hidden />;
}
