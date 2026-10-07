import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import { footerNav } from "@/lib/navigation";
import type { SiteSettings } from "@/types/domain";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-16 bg-ink-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src={assets.logo} alt="" width={56} height={56} className="h-14 w-14" />
            <p className="font-serif text-2xl leading-tight">{settings.clubName}</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">{settings.claim}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-amber">Stránky</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/85 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-amber">Kontakt</h2>
          <div className="mt-4 space-y-2 text-sm text-white/85">
            {settings.address ? <p>{settings.address}</p> : <p>Adresu doplní správa klubu.</p>}
            {settings.email ? <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p> : null}
            {settings.phone ? <p>{settings.phone}</p> : null}
            {settings.ico ? <p>IČO {settings.ico}</p> : null}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.clubName}</p>
          <p>
            Vyrobil{" "}
            <a href="https://vrbajiri.digital" target="_blank" rel="noopener noreferrer" className="text-white underline decoration-amber underline-offset-2">
              stržm. Vrba Jiří
            </a>
          </p>
          <Link href="/sprava" className="text-white/50 hover:text-white">
            Správa
          </Link>
        </div>
      </div>
    </footer>
  );
}
