import type { Metadata } from "next";
import { DogScreen } from "@/components/data/dog-screen";

export const metadata: Metadata = { title: "Chovní psi" };

export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <DogScreen title="Chovní psi" lead="Psi se zveřejněnou chovností." crumbs={[{ label: "Chov" }, { label: "Chovní psi" }]} searchParams={searchParams} preset={{ sex: "male", breeding: "breeding" }} />;
}
