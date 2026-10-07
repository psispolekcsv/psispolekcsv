import { ResourceScreen } from "@/components/admin/resource-screen";
import { textParam } from "@/lib/filters";
import { breedingLabel } from "@/lib/labels";
import { getDogAdmin, listDogs } from "@/lib/server/data";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const id = textParam((await searchParams).id);
  const items = await listDogs();
  const detail = id ? await getDogAdmin(id) : null;
  const dog = detail?.dog;
  return (
    <ResourceScreen
      title="Psi"
      kind="dog"
      collection="dogs"
      editId={dog?.id}
      fileName="photo"
      intro="Majitel, telefon a e-mail zůstávají v neveřejné evidenci. Čip se na webu ukáže jen se zaškrtnutím."
      items={items.map((item) => ({ id: item.id, title: item.name, meta: item.published ? breedingLabel[item.breedingStatus] : "skryto" }))}
      defaults={
        dog
          ? {
              name: dog.name,
              sex: dog.sex,
              birthDate: dog.birthDate.slice(0, 10),
              registrationNumber: dog.registrationNumber,
              chip: detail?.rawChip || "",
              publishChip: detail?.publishChip ? "true" : "",
              kennelName: dog.kennelName,
              sireName: dog.sireName,
              damName: dog.damName,
              breederName: dog.breederName,
              country: dog.country,
              breedingStatus: dog.breedingStatus,
              bonitation: dog.bonitation,
              titles: dog.titles.join(", "),
              exams: dog.exams.join(", "),
              healthSummary: dog.healthSummary,
              lifeStatus: dog.lifeStatus,
              published: dog.published ? "true" : "",
              ownerName: detail?.privateData.ownerName || "",
              ownerEmail: detail?.privateData.ownerEmail || "",
              ownerPhone: detail?.privateData.ownerPhone || "",
              notes: detail?.privateData.notes || "",
            }
          : { sex: "male", breedingStatus: "none", lifeStatus: "active", country: "Česko" }
      }
      fields={[
        { name: "name", label: "Jméno", required: true },
        { name: "sex", label: "Pohlaví", type: "select", options: [{ value: "male", label: "Pes" }, { value: "female", label: "Fena" }] },
        { name: "birthDate", label: "Narození", type: "date" },
        { name: "registrationNumber", label: "Číslo zápisu" },
        { name: "chip", label: "Čip", help: "Veřejně jen při zaškrtnutí níže." },
        { name: "publishChip", label: "Zveřejnit čip", type: "checkbox" },
        { name: "kennelName", label: "Chovatelská stanice" },
        { name: "sireName", label: "Otec" },
        { name: "damName", label: "Matka" },
        { name: "breederName", label: "Chovatel" },
        { name: "country", label: "Země" },
        { name: "breedingStatus", label: "Chovnost", type: "select", options: Object.entries(breedingLabel).map(([value, label]) => ({ value, label })) },
        { name: "bonitation", label: "Bonitace" },
        { name: "titles", label: "Tituly", help: "Oddělte čárkou." },
        { name: "exams", label: "Zkoušky", help: "Oddělte čárkou." },
        { name: "healthSummary", label: "Veřejné shrnutí zdraví", type: "textarea" },
        { name: "lifeStatus", label: "Stav", type: "select", options: [{ value: "active", label: "Aktivní" }, { value: "deceased", label: "Zemřelý" }] },
        { name: "ownerName", label: "Majitel (neveřejné)" },
        { name: "ownerEmail", label: "E-mail majitele (neveřejné)", type: "email" },
        { name: "ownerPhone", label: "Telefon majitele (neveřejné)" },
        { name: "notes", label: "Interní poznámka", type: "textarea" },
        { name: "published", label: "Zveřejnit profil", type: "checkbox" },
      ]}
    />
  );
}
