import type { Role } from "@/types/domain";

export interface Actor {
  uid: string;
  role: Role;
  approved: boolean;
  disabled?: boolean;
}

export function canAccessAdmin(user: Actor | null) {
  if (!user || user.disabled || !user.approved) return false;
  return user.role === "admin" || user.role === "superadmin";
}

export function canManageAdmins(user: Actor | null) {
  return Boolean(user && user.approved && !user.disabled && user.role === "superadmin");
}

export type RoleDecision = { ok: true } | { ok: false; reason: string };

export function assertRoleChange(input: {
  actor: Actor;
  targetUid: string;
  nextRole: Role;
}): RoleDecision {
  if (!canManageAdmins(input.actor)) {
    return { ok: false, reason: "Změnu role může provést jen hlavní administrátor." };
  }
  if (input.actor.uid === input.targetUid) {
    return { ok: false, reason: "Administrátor si nemůže změnit vlastní oprávnění." };
  }
  if (input.actor.role !== "superadmin") {
    return { ok: false, reason: "Běžný administrátor nemůže měnit role." };
  }
  if (input.nextRole === "superadmin" && input.actor.role !== "superadmin") {
    return { ok: false, reason: "Běžný administrátor nemůže vytvořit hlavního administrátora." };
  }
  if (input.nextRole !== "pending" && input.nextRole !== "admin" && input.nextRole !== "superadmin") {
    return { ok: false, reason: "Neznámá role." };
  }
  return { ok: true };
}
