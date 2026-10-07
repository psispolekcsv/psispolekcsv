# Klub československého vlčáka

Informační portál českého chovatelského klubu: veřejné stránky o plemeni, databáze chovu, formuláře s oboustranným schválením a správa obsahu. Testovací doména je [jirivrbatestweb.asia](https://jirivrbatestweb.asia).

Texty o plemeni vycházejí ze standardu FCI č. 332. Nejsou to údaje jiného klubu a databáze neobsahuje vymyšlené psy.

## Stack

- Next.js 15 (App Router) a TypeScript
- Tailwind CSS
- Firebase Authentication, Cloud Firestore a Storage
- Firebase Admin SDK jen na serveru
- Zod pro šablony formulářů
- Resend pro e-maily, bez klíče se pošta zapíše do logu serveru
- nasazení na Vercel, repozitář na GitHubu

## Instalace

```bash
npm install
cp .env.example .env.local
npm run dev
```

Vývoj běží na [http://localhost:3000](http://localhost:3000). Správa je na `/sprava`, odkaz je v patičce.

## Prostředí

Veřejné proměnné (`NEXT_PUBLIC_*`) patří do prohlížeče. Service account a klíč k poště ne.

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=psi-spolek.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=psi-spolek
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=psi-spolek.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1078927213615
NEXT_PUBLIC_FIREBASE_APP_ID=1:1078927213615:web:b20e7e6d621b1b337cb2da
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-WF509SD0DV
NEXT_PUBLIC_SITE_URL=https://jirivrbatestweb.asia
NEXT_PUBLIC_MASCOT_ADVISOR=false

FIREBASE_SERVICE_ACCOUNT_JSON=
RESEND_API_KEY=
EMAIL_FROM="Klub československého vlčáka <noreply@jirivrbatestweb.asia>"
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
APPROVAL_TOKEN_TTL_HOURS=336
RATE_LIMIT_SALT=
```

`FIREBASE_SERVICE_ACCOUNT_JSON` je celý JSON účtu služby na jednom řádku. Soubor s klíčem do gitu nepatří.

Veřejný web bez service accountu zobrazí výchozí texty. Zápis, přihlášení do správy a odeslání formuláře service account potřebují.

## Firebase

Projekt: `psi-spolek` (číslo `1078927213615`).

1. Authentication → Sign-in method → zapnout E-mail/heslo.
2. Vytvořit Firestore v produkčním režimu.
3. Vytvořit Storage.
4. Pravidla zkopírovat z `firestore.rules` a `storage.rules` a publikovat. Stejné soubory umí nasadit Firebase CLI (`firebase.json`).
5. Indexy nasadit z `firestore.indexes.json`. Aplikace menší výpisy zvládne i bez nich, složené dotazy je časem budou chtít.
6. Project settings → Service accounts → vygenerovat klíč a vložit ho do `FIREBASE_SERVICE_ACCOUNT_JSON`.
7. U webového API klíče v Google Cloud omezit HTTP referrery na doménu webu a localhost.

Analytics se spouští jen v prohlížeči.

### První hlavní administrátor

1. Na `/sprava/registrace` založte účet. Vznikne `users/{uid}` s `role: "pending"` a `approved: false`.
2. V konzoli Firestore u tohoto dokumentu jednorázově nastavte `role: "superadmin"` a `approved: true`.
3. Odhlaste se a přihlaste znovu. Dál už další administrátory schvalujete v menu Administrátoři.

Heslo v kódu není. Běžný administrátor si roli nezvýší a dalšího hlavního administrátora nezaloží. Změna role jde jen přes server a Admin SDK.

Nová registrace do správy nevpustí, dokud ji hlavní administrátor neschválí.

## E-mail

Bez `RESEND_API_KEY` se zprávy vypíšou do konzole (`[email:dev]`), včetně odkazů ke schválení. To stačí na lokální zkoušku.

V produkci ověřte doménu u Resend a nastavte `EMAIL_FROM` na adresu z této domény. Obnova hesla jde přes Firebase Authentication, ne přes Resend.

Volitelně Cloudflare Turnstile: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` a `TURNSTILE_SECRET_KEY`. Bez nich se kontrola robotů přeskakuje.

## Formuláře a dvě strany

Ve správě je tvůrce formulářů a tlačítko pro výchozí šablony (přihláška, krycí list, vrh, bonitace, inzerát a další).

U typu „dvě osoby“ vyplní první strana i e-mail druhé. Server uloží podání, oběma pošle odkaz s náhodným tokenem a do databáze dá jen jeho hash. Token má platnost, nejde použít znovu a není svázaný s jiným podáním. Dokud nepotvrdí obě strany, stav není `approved`. Po obou potvrzeních se údaje uzamknou a oběma přijde závěrečný e-mail s odkazem na kopii. Změna uzavřeného podání je nová revize.

## Vývoj, testy a build

```bash
npm run dev
npm test
npm run lint
npm run build
npm start
```

Testy pokrývají role, stavy oboustranného schválení, jednorázový a prošlý token a validaci polí.

## Vercel

1. Repozitář připojte k projektu na Vercelu.
2. Stejné proměnné jako v `.env.local` vložte do Environment Variables. Service account je jen tam, nikdy do `NEXT_PUBLIC_`.
3. `NEXT_PUBLIC_SITE_URL` nastavte na `https://jirivrbatestweb.asia`.
4. Doménu přidejte v nastavení projektu a DNS namiřte podle Vercelu.

## Bezpečnost

- Veřejný klient nezapisuje role, podání, tokeny, audit ani e-maily.
- Pravidla Firestore nejsou náhrada kontroly na serveru. Chráněné operace znovu ověřují session cookie.
- Citlivé údaje psa jsou v `dogsPrivate`. Veřejný profil čip ukáže jen když to správa zaškrtne.
- V URL schválení není obsah formuláře.
- Audit běžný administrátor neupravuje a v rozhraní ho vidí jen hlavní administrátor.

## Grafika

Logo je ve `public/fotky/logo`, maskoti ve `public/fotky/maskot`. Poradce s maskotem je připravený (`WolfMascot`, `AdvisorMascot`, `MascotBubble`) a zapne ho `NEXT_PUBLIC_MASCOT_ADVISOR=true`.

Fotografie skutečných psů se doplní ve správě galerie a u profilů. Dokud tam nejsou, web je nenahrazuje cizími snímky.
