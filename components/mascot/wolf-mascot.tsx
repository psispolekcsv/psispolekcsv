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
    <div className={`relative ${className}`}>
      <Image src={image.src} alt={image.alt} fill priority={priority} sizes="(min-width: 768px) 420px, 80vw" className="object-contain" />
    </div>
  );
}
