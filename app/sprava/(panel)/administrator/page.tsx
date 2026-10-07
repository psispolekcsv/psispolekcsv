import { setUserRoleAction } from "@/app/sprava/(panel)/actions";
import { roleLabel } from "@/lib/labels";
import { requireSuperadmin } from "@/lib/server/session";
import { listUsers } from "@/lib/server/data";

export default async function Page() {
  const actor = await requireSuperadmin();
  const users = await listUsers();
  return (
    <div>
      <h1 className="font-serif text-4xl">Administrátoři</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/70">Schválení dělá jen hlavní administrátor. Vlastní roli si nikdo nezmění. Nový účet vznikne registrací a zůstane bez přístupu, dokud ho tady neschválíte.</p>
      <ul className="mt-6 space-y-3">
        {users.map((user) => (
          <li key={user.uid} className="rounded-lg bg-white p-4">
            <p className="font-semibold">{user.displayName || user.email}</p>
            <p className="text-sm text-ink/70">{user.email} · {roleLabel[user.role]}{user.disabled ? " · deaktivován" : ""}</p>
            {user.uid === actor.uid ? <p className="mt-2 text-sm">Toto je váš účet.</p> : (
              <form action={setUserRoleAction} className="mt-3 flex flex-wrap items-end gap-3">
                <input type="hidden" name="uid" value={user.uid} />
                <input type="hidden" name="email" value={user.email} />
                <label className="text-sm font-semibold">Role
                  <select name="role" defaultValue={user.role} className="mt-1 block rounded-md border border-line px-2 py-2 font-normal">
                    <option value="pending">Čeká na schválení</option>
                    <option value="admin">Administrátor</option>
                    <option value="superadmin">Hlavní administrátor</option>
                  </select>
                </label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="disabled" defaultChecked={user.disabled} /> Deaktivovat</label>
                <button className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white">Uložit oprávnění</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
