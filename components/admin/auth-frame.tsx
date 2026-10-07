import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";

export function AuthFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-line bg-white p-6">
        <Link href="/" className="mb-4 flex items-center gap-3">
          <Image src={assets.logo} alt="" width={48} height={48} />
          <span className="font-serif text-xl">Klub československého vlčáka</span>
        </Link>
        <h1 className="mb-4 font-serif text-3xl">{title}</h1>
        {children}
      </div>
    </main>
  );
}
