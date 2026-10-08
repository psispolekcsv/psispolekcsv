"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase/client";

function authError(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code: string }).code) : "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) return "E-mail nebo heslo nesedí.";
  if (code.includes("email-already-in-use")) return "Účet s tímto e-mailem už existuje.";
  if (code.includes("weak-password")) return "Heslo je příliš krátké. Použijte alespoň 6 znaků.";
  if (code.includes("invalid-email")) return "E-mail není platný.";
  return error instanceof Error ? error.message : "Operace se nezdařila.";
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const auth = getAuth(getFirebaseApp());
      const cred = await signInWithEmailAndPassword(auth, String(data.get("email") || ""), String(data.get("password") || ""));
      const idToken = await cred.user.getIdToken();
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const body = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(body.message || "Server nepřijal přihlášení.");
      router.push("/sprava");
    } catch (caught) {
      setError(authError(caught));
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <label className="text-sm font-semibold">E-mail<input name="email" type="email" required autoComplete="username" className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
      <label className="text-sm font-semibold">Heslo<input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
      {error ? <p role="alert" className="text-sm text-danger">{error}</p> : null}
      <button disabled={pending} className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">{pending ? "Přihlašuji…" : "Přihlásit"}</button>
      <p className="text-sm"><Link href="/sprava/registrace" className="underline">Registrovat účet</Link> · <Link href="/sprava/zapomenute-heslo" className="underline">Zapomenuté heslo</Link></p>
    </form>
  );
}

export function RegisterForm() {
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const auth = getAuth(getFirebaseApp());
      const cred = await createUserWithEmailAndPassword(auth, String(data.get("email") || ""), String(data.get("password") || ""));
      const name = String(data.get("name") || "");
      if (name) await updateProfile(cred.user, { displayName: name });
      const idToken = await cred.user.getIdToken();
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, displayName: name }),
      });
      const body = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(body.message || "Účet se nepodařilo založit.");
      await fetch("/api/auth/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) });
      setDone(body.message || "Účet byl vytvořen. Přístup do správy musí nejprve schválit hlavní administrátor.");
    } catch (caught) {
      setError(authError(caught));
    } finally {
      setPending(false);
    }
  }

  if (done) return <p role="status" className="text-sm leading-relaxed">{done}</p>;
  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <label className="text-sm font-semibold">Jméno<input name="name" className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
      <label className="text-sm font-semibold">E-mail<input name="email" type="email" required className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
      <label className="text-sm font-semibold">Heslo<input name="password" type="password" required minLength={6} autoComplete="new-password" className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
      {error ? <p role="alert" className="text-sm text-danger">{error}</p> : null}
      <button disabled={pending} className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">{pending ? "Vytvářím…" : "Vytvořit účet"}</button>
      <p className="text-sm"><Link href="/sprava/prihlaseni">Zpět na přihlášení</Link></p>
    </form>
  );
}

export function ResetForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const email = String(new FormData(event.currentTarget).get("email") || "");
    try {
      await sendPasswordResetEmail(getAuth(getFirebaseApp()), email);
      setMessage("Pokud účet existuje, Firebase pošle odkaz pro nové heslo.");
    } catch (caught) {
      setError(authError(caught));
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <label className="text-sm font-semibold">E-mail<input name="email" type="email" required className="mt-1 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
      {message ? <p role="status" className="text-sm">{message}</p> : null}
      {error ? <p role="alert" className="text-sm text-danger">{error}</p> : null}
      <button className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Poslat odkaz</button>
      <p className="text-sm"><Link href="/sprava/prihlaseni">Zpět na přihlášení</Link></p>
    </form>
  );
}
