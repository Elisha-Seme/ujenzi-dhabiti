import { redirect } from "next/navigation";

// Legacy route from the original pan-African infrastructure brief.
// The current site uses "What We've Built" — redirect to keep old links alive.
export default function ProjectsPage() {
  redirect("/what-we-built");
}
