import type { Metadata } from "next";
import { DogScreen } from "@/components/data/dog-screen";

export const metadata: Metadata = { title: "Psi se zkouškami" };

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <DogScreen title="Psi se zkouškami" lead="Jedinci, u kterých správa zapsala zkoušku." crumbs={[{ label: "Výcvik" }, { label: "Psi se zkouškami" }]} searchParams={searchParams} preset={{ exams: true }} />;
}
