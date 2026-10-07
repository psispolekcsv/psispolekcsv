import { features } from "@/lib/features";
import { MascotBubble } from "@/components/mascot/mascot-bubble";
import { WolfMascot } from "@/components/mascot/wolf-mascot";

export function AdvisorMascot() {
  if (!features.mascotAdvisor) return null;
  return (
    <aside className="fixed bottom-4 right-4 z-30 hidden items-end gap-3 md:flex" aria-label="Maskot poradny">
      <MascotBubble>Poradna zatím odpovídá textem na stránkách. Osobního průvodce klub zapne později.</MascotBubble>
      <WolfMascot variant="puppy" className="h-28 w-28" />
    </aside>
  );
}
