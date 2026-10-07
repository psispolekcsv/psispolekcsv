import { RecordForm } from "@/components/admin/record-form";
import { getSettings } from "@/lib/server/data";

export default async function Page() {
  const settings = await getSettings();
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 font-serif text-4xl">Nastavení a kontakty</h1>
      <RecordForm
        kind="settings"
        defaults={Object.fromEntries(Object.entries(settings))}
        fields={[
          { name: "clubName", label: "Název klubu" },
          { name: "claim", label: "Krátký popis", type: "textarea" },
          { name: "heroTitle", label: "Titulek úvodu" },
          { name: "heroLead", label: "Text úvodu", type: "textarea" },
          { name: "breedIntro", label: "Odstavec o plemeni", type: "textarea" },
          { name: "email", label: "E-mail", type: "email" },
          { name: "phone", label: "Telefon" },
          { name: "address", label: "Adresa", type: "textarea" },
          { name: "ico", label: "IČO" },
          { name: "bankAccount", label: "Číslo účtu" },
          { name: "iban", label: "IBAN" },
        ]}
      />
    </div>
  );
}
