import type { Metadata } from "next";
import { DogScreen } from "@/components/data/dog-screen";

export const metadata: Metadata = { title: "Chovné feny" };

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <DogScreen title="Chovné feny" lead="Feny se zveřejněnou chovností." crumbs={[{ label: "Chov" }, { label: "Chovné feny" }]} searchParams={searchParams} preset={{ sex: "female", breeding: "breeding" }} />;
}
