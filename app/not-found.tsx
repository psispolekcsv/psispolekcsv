import Link from "next/link";
import { WolfMascot } from "@/components/mascot/wolf-mascot";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
      <WolfMascot variant="puppy" className="h-56 w-56" />
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-amber-deep">404</p>
      <h1 className="mt-2 font-serif text-4xl text-ink-deep">Tahle stopa nikam nevede</h1>
      <p className="mt-3 text-ink/75">Stránka neexistuje, nebo ji správa klubu ještě nezveřejnila.</p>
      <Link href="/" className="mt-6 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
        Zpět na úvod
      </Link>
    </main>
  );
}
