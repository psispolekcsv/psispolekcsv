import type { Metadata } from "next";
import { DogScreen } from "@/components/data/dog-screen";

export const metadata: Metadata = { title: "Psi" };

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <DogScreen title="Psi" lead="Veřejná databáze psů." crumbs={[{ label: "Databáze" }, { label: "Psi" }]} searchParams={searchParams} preset={{ sex: "male" }} />;
}
