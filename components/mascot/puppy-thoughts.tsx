import Image from "next/image";
import { assets } from "@/lib/assets";

const bubbles = [
  { icon: assets.iconTreat, label: "pamlsek", flight: "bubble-flight-1", size: "h-[6.25rem] w-[6.25rem]", delay: "0s" },
  { icon: assets.iconSausage, label: "klobása", flight: "bubble-flight-2", size: "h-20 w-20", delay: "-1.6s" },
  { icon: assets.iconToy, label: "hračka", flight: "bubble-flight-3", size: "h-[5.5rem] w-[5.5rem]", delay: "-3.2s" },
  { icon: assets.iconTreat, label: "pamlsek-2", flight: "bubble-flight-4", size: "h-[4.5rem] w-[4.5rem]", delay: "-4.8s" },
  { icon: assets.iconSausage, label: "klobása-2", flight: "bubble-flight-5", size: "h-[5.25rem] w-[5.25rem]", delay: "-6.4s" },
  { icon: assets.iconToy, label: "hračka-2", flight: "bubble-flight-6", size: "h-[5.5rem] w-[5.5rem]", delay: "-8s" },
];

export function PuppyThoughts() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {bubbles.map((bubble) => (
        <span key={bubble.label} className={`bubble-flight absolute left-1/2 top-1/2 ${bubble.flight} ${bubble.size}`} style={{ animationDelay: bubble.delay }}>
          <Image src={assets.bubble} alt="" width={220} height={220} className="h-full w-full object-contain" />
          <Image
            src={bubble.icon}
            alt=""
            width={160}
            height={110}
            className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_1px_1px_rgba(60,30,0,0.35)]"
          />
          <span className="bubble-ring absolute left-1/2 top-1/2 h-[86%] w-[86%] rounded-full border-[3px] border-white/90" />
        </span>
      ))}
    </div>
  );
}
