import type { CmsPage, SiteSettings } from "@/types/domain";

export const defaultSettings: SiteSettings = {
  clubName: "Klub československého vlčáka",
  claim: "Pracovní plemeno s vlčím vzhledem. Portál pro chovatele, majitele a zájemce o československého vlčáka.",
  email: "",
  phone: "",
  address: "",
  ico: "",
  bankAccount: "",
  iban: "",
  heroTitle: "Klub československého vlčáka",
  heroLead:
    "Informační portál klubu: plemeno, chov, akce, dokumenty a databáze vedená přímo správou klubu.",
  breedIntro:
    "Československý vlčák vznikl křížením německého ovčáka a karpatského vlka. Vzhledem, pohybem, srstí i zbarvením vlka připomíná a standard jej popisuje jako živého, vytrvalého a svému majiteli velmi loajálního psa.",
};

type PageSeed = Pick<CmsPage, "slug" | "title" | "description" | "content">;

export const defaultPages: Record<string, PageSeed> = {
  "klub-o-klubu": {
    slug: "klub-o-klubu",
    title: "O klubu",
    description: "Čím se Klub československého vlčáka zabývá.",
    content: `Klub československého vlčáka je odborné společenství majitelů, chovatelů a příznivců plemene. Tyto stránky jsou jeho informačním portálem.

Klub vede evidenci chovu, zveřejňuje termíny akcí, přijímá přihlášky a zpřístupňuje dokumenty, které schválí jeho orgány. Databáze psů, stanic a vrhů se plní výhradně ze správy webu. Dokud správa údaj nezveřejní, stránka zůstane prázdná a nevydává odhad za skutečný stav chovu.

Sídlo, identifikační údaje a složení výboru doplní klub do kontaktů. Do té doby je nepřebíráme z jiných organizací a nevymýšlíme je.`,
  },
  "klub-clenstvi": {
    slug: "klub-clenstvi",
    title: "Členství",
    description: "Jak požádat o členství v klubu.",
    content: `O členství lze požádat formulářem Přihláška do klubu. Žadatel vyplní údaje, potvrdí je odkazem z e-mailu a o přijetí rozhodne správa klubu.

Výši členského příspěvku, splatnost a případné slevy zveřejní výbor v ceníku. Dokud tam částka není, neplatí žádná domnělá cena.

Členství samo o sobě nezakládá chovnost psa. Podmínky uchovnění popisuje chovatelský řád, až ho klub vloží mezi dokumenty.`,
  },
  "klub-vybor": {
    slug: "klub-vybor",
    title: "Výbor a kontakty",
    description: "Kontakty na orgány klubu.",
    content: `Jména členů výboru, poradce chovu a garanti jednotlivých oblastí se zveřejňují zde, jakmile je správa klubu zapíše.

Do té doby používejte obecný kontakt na stránce Kontakty. Neuvádíme cizí telefonní čísla ani e-maily jiných klubů.`,
  },
  "klub-cenik": {
    slug: "klub-cenik",
    title: "Ceník a platby",
    description: "Poplatky a platební údaje klubu.",
    content: `Členské příspěvky, startovné na akce, poplatky za bonitaci, svod a krycí listy doplní správa do této stránky spolu s číslem účtu.

Platební údaje z jiných kynologických organizací sem nepatří. Variabilní symbol a účel platby se řídí pokynem, který klub uvede u konkrétní akce nebo formuláře.`,
  },
  plemeno: {
    slug: "plemeno",
    title: "O československém vlčákovi",
    description: "Základní fakta podle standardu FCI č. 332.",
    content: `Československý vlčák je plemeno pracovní skupiny. Oficiální název ve standardu FCI zní Československý vlčák, v anglickém znění Czechoslovakian Wolfdog. Platný odkaz je standard FCI č. 332, zveřejněný 3. září 1999.

Původ je bývalá Československá republika. Patronát má Slovenská republika. Využití je pracovní pes. Ve třídění FCI patří do skupiny 1, sekce ovčáčtí psi, se zkouškou z výkonu.

V roce 1955 proběhl v tehdejší ČSSR biologický experiment: křížení německého ovčáka s karpatským vlkem. Potomstvo spojení psa s vlčicí i vlka s fenou bylo odchovatelné a většina z něj měla předpoklady pro další chov. Po ukončení experimentu vznikl v roce 1965 plán systematického chovu, který měl spojit použitelné vlastnosti vlka s příznivými vlastnostmi psa. V roce 1982 byl československý vlčák uznán jako národní plemeno.

Obecný vzhled standard popisuje jako pevný typ nadprůměrného vzrůstu s obdélníkovým rámcem. Tvarem těla, pohybem, strukturou srsti, barvou a maskou se podobá vlku.

Kohoutková výška je u psů nejméně 65 cm a u fen nejméně 60 cm. Hmotnost je u psů nejméně 26 kg a u fen nejméně 20 kg. Poměr délky těla ke kohoutkové výšce je 10 : 9.

Úplné znění včetně vad a vylučujících vad je ve standardu. Na webu je ke stažení oficiální anglické znění FCI. Úředním jazykem standardu je němčina. Text na těchto stránkách je věcný výtah, nikoli náhrada standardu.`,
  },
  "plemeno-historie": {
    slug: "plemeno-historie",
    title: "Historie plemene",
    description: "Vznik plemene podle historického úvodu standardu FCI č. 332.",
    content: `Historický úvod standardu FCI č. 332 uvádí tento sled.

V roce 1955 se v tehdejší Československé republice uskutečnil biologický experiment, křížení německého ovčáka s karpatským vlkem. Ukázalo se, že potomky lze odchovat jak ze spojení psa a vlčice, tak ze spojení vlka a feny. Většina těchto potomků nesla genetické předpoklady pro pokračování chovu.

V roce 1965, po skončení experimentu, byl vypracován plán chovu nového plemene. Cílem bylo spojit použitelné vlastnosti vlka s příznivými vlastnostmi psa.

V roce 1982 československého vlčáka uznal jako národní plemeno tehdejší ústřední výbor chovatelských organizací ČSSR.

Další klubová historie, jména zakladatelů konkrétních linií a chronika tohoto klubu budou doplněny, až je správa zveřejní z vlastních podkladů. Nepřebíráme je z cizích webů.`,
  },
  "plemeno-standard": {
    slug: "plemeno-standard",
    title: "Standard FCI",
    description: "Věcný výtah standardu FCI č. 332 a odkaz na původní PDF.",
    content: `Níže je věcný výtah podle FCI-Standard N° 332 ze dne 3. 9. 1999. Překlad anglického znění: paní C. Seidler. Úřední jazyk je němčina. Výtah nenahrazuje standard. Původní PDF je na této stránce ke stažení.

**Původ:** bývalá Československá republika. **Patronát:** Slovenská republika. **Využití:** pracovní pes. **Zařazení:** skupina 1, ovčáčtí a honáčtí psi, sekce 1, ovčáci, se zkouškou z výkonu.

**Poměry.** Délka těla ku kohoutkové výšce 10 : 9. Délka mordy ku délce mozkovny 1 : 1,5.

**Povaha.** Živý, velmi aktivní, vytrvalý, učenlivý, s rychlými reakcemi. Nebojácný a odvážný. Nedůvěřivý. Ke svému pánovi projevuje mimořádnou věrnost. Odolný vůči povětrnosti. Všestranně použitelný.

**Hlava.** Souměrná, dobře osvalená, při pohledu ze strany i shora tvoří tupý klín. Pohlavní výraz má být jednoznačný. Čelo mírně klenuté, bez výrazné čelní rýhy, týlní hrbol zřetelný. Stop mírný. Nos oválný, černý. Morda čistá, ne široká, hřbet rovný. Pysky přiléhavé, okraje černé. Čelisti silné a souměrné, zuby dobře vyvinuté, zejména špičáky. Skus nůžkový nebo klešťový, 42 zubů v pravidelném postavení.

**Oči.** Malé, šikmé, jantarové, s dobře přiléhajícími víčky.

**Uši.** Vztyčené, tenké, trojúhelníkové, krátké, ne delší než šestina kohoutkové výšky. Vnější úpon ucha a vnější koutek oka jsou v jedné přímce.

**Krk.** Suchý, dobře osvalený. V klidu svírá s vodorovnou rovinou úhel do 40 stupňů a je dost dlouhý, aby pes bez námahy dosáhl nosem k zemi.

**Tělo.** Hřbetní linie plynule navazuje na krk a mírně se svažuje. Kohoutek osvalený a výrazný, ale nepřerušuje linii. Hřbet pevný a rovný. Bedra krátká, osvalená, ne široká, mírně spáditá. Záď krátká, osvalená, ne široká, mírně spadající. Hrudník souměrný, prostorný, hruškovitý, zužuje se k hrudní kosti. Hloubka nedosahuje k loktům a hrudní kost nepřečnívá před ramenní klouby. Břicho pevné, vtažené.

**Ocas.** Vysoko nasazený, v klidu visí rovně. V afektu se zpravidla zvedá do srpu.

**Končetiny a pohyb.** Hrudní končetiny rovné, silné, suché, poměrně úzce postavené, tlapky mírně vytočené. Pánevní končetiny mohutné a rovnoběžné. Paspárky jsou nežádoucí a mají se odstranit. Pohyb je harmonický, lehký a prostorný klus, při kterém končetiny jdou co nejníže nad zemí. V kroku je přípustný mimochod. Hlava a krk se při klusu nesou k vodorovné linii.

**Kůže a srst.** Kůže pružná, těsná, bez vrásek, nepigmentovaná. Srst rovná a přiléhavá. Zimní a letní srst se výrazně liší. V zimě převládá hustá podsada. Osrstění má krýt břicho, vnitřek stehen, šourek, vnitřek ucha i meziprstí. Krk je dobře osrstěný.

**Barva.** Žlutošedá až stříbrošedá s charakteristickou světlou maskou. Světlá srst je i na spodní straně krku a na předhrudí. Přípustná je i tmavošedá barva se světlou maskou.

**Výška a hmotnost.** Psi nejméně 65 cm a 26 kg, feny nejméně 60 cm a 20 kg.

**Vady a vylučující vady** standard vyjmenovává úměrně jejich závažnosti a dopadu na zdraví. Mezi vylučující patří mimo jiné agresivita nebo přílišná bázlivost, zjevné tělesné či povahové abnormality, odchylka od poměrů, netypická hlava, chybějící zuby nad rámec tolerance, nepravidelný skus, netypické oko nebo ucho, lalok, silně spáditá záď, netypický hrudník a ocas, odstávající nebo jinak netypická srst, jiná než standardní barva, volné vazy a netypický pohyb. Ke krytí se používají jen funkčně a klinicky zdraví jedinci typičtí pro plemeno. Psi mají mít dvě zjevně normální varlata sestouplá v šourku.

Chybění dvou prvních premolárů nebo obou třetích molárů se podle standardu netrestá. Kombinace těchto ztrát už vadou je.`,
  },
  "plemeno-povaha": {
    slug: "plemeno-povaha",
    title: "Povaha a využití",
    description: "Temperament a pracovní využití podle standardu.",
    content: `Standard popisuje temperament přímo: živý, velmi aktivní, vytrvalý, učenlivý, s rychlými reakcemi, nebojácný a odvážný, nedůvěřivý a svému pánovi mimořádně věrný. Pes je odolný vůči počasí a všestranně použitelný.

Využití ve standardu je pracovní pes, ve skupině ovčáků se zkouškou z výkonu. Není to okrasný společník bez nároků na vedení. Nedůvěra k cizím lidem je součást popisu plemene, ne vada, kterou by měl majitel lámat tvrdostí.

Konkrétní zkušební řády, které klub uznává pro chov nebo sport, budou mezi dokumenty. Dokud tam nejsou, neuvádíme vlastní bodovací tabulky.`,
  },
  "plemeno-pece": {
    slug: "plemeno-pece",
    title: "Péče a soužití",
    description: "Co z popisu plemene plyne pro každodenní soužití.",
    content: `Srst je rovná a přiléhavá a mezi zimou a létem se výrazně mění. V zimě je podsada hustá. To znamená sezónní línání, ne složitou úpravu srsti.

Pes je vytrvalý a velmi aktivní. Potřebuje pohyb a zaměstnání, které odpovídá pracovnímu psu, a klidné, důsledné vedení od raného věku. Socializace má počítat s tím, že standard psa popisuje jako nedůvěřivého.

Nejde o veterinární návod. Očkování, odčervení, výživu a řešení zdravotních potíží svěřte veterinárnímu lékaři. Podmínky vyšetření pro chov zveřejní klub v dokumentech, až je schválí.`,
  },
  "plemeno-faq": {
    slug: "plemeno-faq",
    title: "Časté dotazy",
    description: "Stručné odpovědi podle standardu a pravidel tohoto webu.",
    content: `**Jaké má plemeno číslo standardu?** FCI č. 332.

**Odkud plemeno pochází?** Ze bývalé Československé republiky. Patronát má Slovenská republika.

**Z jakého křížení vzniklo?** Z německého ovčáka a karpatského vlka. Plán systematického chovu následoval po experimentu a jako národní plemeno byl československý vlčák uznán v roce 1982.

**Jakou má barvu očí?** Standard požaduje malé, šikmé, jantarové oko. Tmavě hnědé, černé nebo jinak zbarvené oko uvádí mezi vadami.

**Jak je velký?** Psi nejméně 65 cm a 26 kg, feny nejméně 60 cm a 20 kg.

**Je vhodný pro každého?** Standard z něj dělá pracovního, aktivního a nedůvěřivého psa s velkou vazbou na majitele. Rozhodnutí o pořízení štěněte má vycházet z tohoto popisu, ne z fotografie.

**Kde jsou chovní jedinci a štěňata?** V databázi klubu. Prázdný seznam znamená, že správa zatím nic nezveřejnila. Není to seznam všech psů plemene v zemi.`,
  },
  "chov-jak-uchovnit": {
    slug: "chov-jak-uchovnit",
    title: "Jak uchovnit",
    description: "Obecný rámec uchovnění. Přesné podmínky určí řád klubu.",
    content: `Uchovnění znamená, že klub psa nebo fenu zařadí mezi jedince, kteří mohou být použiti v řízeném chovu. Přesný postup, věk, zkoušky a povinná vyšetření stanoví bonitační a chovatelský řád. Až je klub vloží do dokumentů, jsou závazné ony, ne tento obecný text.

Obvyklý rámec u pracovního plemene FCI vypadá takto. Pes má průkaz původu, odpovídá standardu a absolvuje bonitaci, tedy posouzení exteriéru a povahy. K tomu přistupují zdravotní vyšetření, která řád výslovně vyžaduje, a případná zkouška z výkonu, protože standard řadí plemeno mezi ovčáky se zkouškou z výkonu.

Žádost se podává formulářem. Kde jsou potřeba dvě strany, například u krycího listu, musí podání potvrdit každá z nich samostatným odkazem z e-mailu. Do té doby zůstane ve stavu čekání a údaje se neuzamknou.

Individuální bonitace má vlastní formulář a není nárok. O jejím umožnění rozhoduje klub.`,
  },
  "chov-pro-chovatele": {
    slug: "chov-pro-chovatele",
    title: "Informace pro chovatele",
    description: "Co chovatel na tomto webu vyřídí.",
    content: `Chovatel zde najde chovné jedince, stanice, nakryté feny, vrhy a zdravotní výsledky, které správa zveřejnila. Může podat žádost o krycí list, oznámení narození vrhu, záznam vyšetření nebo žádost o zápis stanice.

Oznámení vrhu a krycí list jsou sestavené pro dvě osoby. Vyplní je jedna strana, druhá dostane bezpečný odkaz a každá potvrzení provede zvlášť. Teprve potom je podání schválené a oběma přijde závěrečný e-mail.

Web automaticky nezakládá vrh v databázi z formuláře. Správa údaj zkontroluje a do veřejné databáze ho vloží sama. Veřejně se nezobrazují soukromé kontakty majitelů, pokud je k tomu záznam výslovně neurčen, jako u inzerce.`,
  },
  vycvik: {
    slug: "vycvik",
    title: "Výcvik a sport",
    description: "Pracovní a sportovní využití československého vlčáka.",
    content: `Standard plemeno řadí mezi pracovní psy se zkouškou z výkonu. Klub může evidovat zkoušky, závody a vlastní soutěže. Výsledky se na web dostanou jen tehdy, když je správa zapíše k danému psovi nebo ke konkrétní akci.

Kontakt na garanta výcviku bude u výboru, až ho klub doplní. Cizí trenéry a cizí e-maily zde neuvádíme.

Zkušební řády jsou ke stažení v dokumentech, jakmile je klub nahraje. Do té doby odkazujeme na řády, které vydává ČMKU nebo pořadatel disciplíny, a nekopírujeme jejich plné znění.`,
  },
  "vycvik-discipliny": {
    slug: "vycvik-discipliny",
    title: "Sportovní disciplíny",
    description: "Jaké disciplíny může klub evidovat.",
    content: `U pracovního plemene se obvykle potkává poslušnost, pachové práce, vytrvalost a další sporty, které mají vlastní zkušební řád. Tento web neuděluje tituly a nevede žebříček, dokud klub výsledky nezadá.

Pokud klub později vyhlásí soutěž za kalendářní rok, podmínky a tabulka budou samostatný dokument. Bez něj se pořadí nezveřejňuje.`,
  },
  "vycvik-souteze": {
    slug: "vycvik-souteze",
    title: "Klubové soutěže",
    description: "Soutěže vyhlášené klubem.",
    content: `Klubové soutěže, jejich období, způsob sčítání bodů a jména garantů zveřejní správa zde a v dokumentech.

Dokud soutěž není vypsaná, web neuvádí vítěze. Žádný žebříček na úvodní stránce není ilustrace skutečných výsledků.`,
  },
  "vycvik-rady": {
    slug: "vycvik-rady",
    title: "Zkušební řády",
    description: "Kde budou řády ke stažení.",
    content: `Zkušební řády patří do knihovny dokumentů, kategorie klubové řády nebo dokumenty ČMKU a FCI. Soubor nahrává správa. Stránka sama řády nevytváří a nepřetiskuje cizí chráněná znění.`,
  },
  poradna: {
    slug: "poradna",
    title: "Poradna",
    description: "Rozcestník pro majitele, zájemce a chovatele.",
    content: `Poradna shrnuje praktické otázky k plemeni, uchovnění a zdraví. Nenahrazuje poradce chovu, rozhodčího ani veterináře.

Odpovědi, které závisí na řádu klubu, odkazují na dokumenty. Kde dokument ještě není, je to řečeno přímo.

Později může odpovědi provázet maskot klubu. V této verzi je vypnutý a na textu poradny nic nemění.`,
  },
  "poradna-budouci-majitele": {
    slug: "poradna-budouci-majitele",
    title: "Pro budoucí majitele",
    description: "Na co se ptát, než si člověk pořídí štěně.",
    content: `Československý vlčák je aktivní pracovní pes s vlčím vzhledem a podle standardu nedůvěřivý k cizím, zato velmi loajální ke svému člověku. Hodí se tam, kde je čas na pohyb, klidné vedení a soužití se psem, který nevyhledává každého návštěvníka.

Štěňata inzerovaná klubem jsou ta, která správa zveřejnila u vrhů nebo v inzerci. Jiné nabídky klub tímto webem nepotvrzuje.

Ptejte se na rodiče, na jejich bonitaci a zveřejněná vyšetření, na průkaz původu a na to, jak chovatel štěňata socializuje. Smlouvu a zdravotní záruky si nechte vysvětlit před převzetím. Web za jednotlivý vrh právně neručí. Ručí za to, že zveřejněný údaj zadal správce klubu.`,
  },
  "poradna-chovatele": {
    slug: "poradna-chovatele",
    title: "Pro chovatele",
    description: "Praktický rozcestník k formulářům a databázi.",
    content: `Než odešlete krycí list nebo hlášení vrhu, ověřte, že jsou obě e-mailové adresy správně. Odkaz ke schválení je jednorázový, má omezenou platnost a v adrese není obsah formuláře.

Po schválení oběma stranami už podání nejde tiše přepsat. Změna je nová revize, původní záznam zůstane.

Zdravotní výsledek vložte jako podklad. Do veřejné databáze ho přenese správa, pokud má být zveřejněn.`,
  },
  "poradna-zdravi": {
    slug: "poradna-zdravi",
    title: "Zdraví",
    description: "Jak klub zveřejňuje vyšetření.",
    content: `U pracovních plemen se v chovu obvykle sledují kyčle, lokty a další nálezy, které stanoví řád. Konkrétní povinnost tohoto klubu začne platit až zněním řádu v dokumentech. Z jiných plemen ji nepřebíráme.

Veřejná databáze ukazuje jen výsledky, které správa označila ke zveřejnění. Sken s osobními údaji veterináře nebo majitele zůstává u podání a na web se sám nedostane.

Posouzení snímku patří specialistovi. Web výsledek nezlehčuje ani nepřepočítává.`,
  },
  "poradna-veterina": {
    slug: "poradna-veterina",
    title: "Veterinární informace",
    description: "Hranice mezi informací klubu a veterinární péčí.",
    content: `Klub není veterinární zařízení. Neošetřuje, nenařizuje léčbu a neuvádí dávkování.

Na této stránce mohou být odkazy a stanoviska, která klub schválí, například seznam vyšetření požadovaných před bonitací. Doplní je správa. Obecná péče o psa patří veterinárnímu lékaři, kterého si majitel zvolí.`,
  },
  "ochrana-osobnich-udaju": {
    slug: "ochrana-osobnich-udaju",
    title: "Ochrana osobních údajů",
    description: "Jak web nakládá s osobními údaji.",
    content: `Správcem údajů zadaných na tomto webu je Klub československého vlčáka. Přesné identifikační údaje doplní klub do kontaktů. Do té doby se za správce nepovažuje dodavatel webu.

Formuláře slouží k vyřízení přihlášky, žádosti nebo inzerátu. Vyplněním a zaškrtnutím souhlasu dáváte údaje k tomuto účelu. U podání dvou stran vidí zadané údaje obě strany, protože každá z nich podání schvaluje, a vidí je správa klubu.

Veřejná databáze neobsahuje e-mail, telefon ani adresu majitele. Čip se zveřejní jen tehdy, když to správa u psa výslovně povolí. Soukromá část záznamu je v oddělené evidenci a z webu ji nelze číst.

Odkaz ke schválení je náhodný a jednorázový. V adrese není obsah formuláře. Po použití nebo po uplynutí platnosti přestane fungovat.

E-mail se odesílá ze serveru. Pro doručení může klub použít externího poskytovatele e-mailu. Bez nastaveného poskytovatele se zpráva jen zapíše do serverového protokolu a adresátovi nepřijde.

Máte právo vědět, které údaje o vás klub vede, žádat opravu a v mezích právních předpisů žádat výmaz. Obraťte se na kontaktní e-mail klubu, jakmile bude zveřejněn. Do té doby použijte e-mail uvedený u konkrétního formuláře, pokud ho správa nastavila.

Web neprodává údaje a nezveřejňuje podání. Přístup do správy má jen účet, který schválil hlavní administrátor.`,
  },
};

export function fallbackPage(slug: string): CmsPage | null {
  const page = defaultPages[slug];
  if (!page) return null;
  return { ...page, published: true, updatedAt: "" };
}
