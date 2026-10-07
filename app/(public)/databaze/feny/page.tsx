import type { Metadata } from "next";
import { DogScreen } from "@/components/data/dog-screen";

export const metadata: Metadata = { title: "Feny" };

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <DogScreen title="Feny" lead="Veřejná databáze fen." crumbs={[{ label: "Databáze" }, { label: "Feny" }]} searchParams={searchParams} preset={{ sex: "female" }} />;
}
