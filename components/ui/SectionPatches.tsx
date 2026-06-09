// Decorative dark + burgundy radial "patches" for light sections — adds depth so
// they don't read as flat white. Drop into a `relative isolate overflow-hidden`
// section; keep the section's real content at z-10 above this.
export default function SectionPatches() {
  return (
    <div aria-hidden className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className="absolute -top-24 -right-28 w-[30rem] h-[30rem] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(138,14,51,0.12), transparent 68%)" }}
      />
      <div
        className="absolute -bottom-32 -left-28 w-[34rem] h-[34rem] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(28,30,34,0.10), transparent 68%)" }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(138,14,51,0.05), transparent 70%)" }}
      />
    </div>
  );
}
