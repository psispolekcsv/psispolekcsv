import Image from "next/image";
import { assets } from "@/lib/assets";

const sources = {
  standing: { src: assets.mascotStanding, alt: "Maskot klubu, československý vlčák ve stoji" },
  allFours: { src: assets.mascotAllFours, alt: "Maskot klubu, československý vlčák na všech čtyřech" },
  female: { src: assets.mascotFemale, alt: "Maskot klubu, fena československého vlčáka" },
  puppy: { src: assets.mascotPuppy, alt: "Maskot klubu, štěně československého vlčáka" },
} as const;

export function WolfMascot({
  variant = "standing",
  priority = false,
  className = "",
}: {
  variant?: keyof typeof sources;
  priority?: boolean;
  className?: string;
}) {
  const image = sources[variant];
  return (
    <div className={`@container relative flex items-center justify-center ${className}`}>
      <div className="relative aspect-square w-[min(100cqw,100cqh)]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[2.4%] left-1/2 z-0 h-3 w-[46%] -translate-x-1/2 rounded-[100%] bg-ink-deep/50 blur-[2px]"
        />
        <Image src={image.src} alt={image.alt} fill priority={priority} sizes="(min-width: 768px) 420px, 80vw" className="z-10 object-contain" />
      </div>
    </div>
  );
}
