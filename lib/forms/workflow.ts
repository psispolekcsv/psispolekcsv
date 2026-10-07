import type { ApprovalType, SubmissionStatus } from "@/types/domain";

export interface WorkflowParty {
  name: string;
  email: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectReason: string;
}

export interface WorkflowState {
  status: SubmissionStatus;
  approvalType: ApprovalType;
  partyA: WorkflowParty;
  partyB: WorkflowParty | null;
  locked: boolean;
}

export type WorkflowEvent =
  | { type: "submit" }
  | { type: "approve"; party: "a" | "b"; at: string }
  | { type: "reject"; party: "a" | "b"; at: string; reason: string }
  | { type: "expire" }
  | { type: "cancel" };

const terminal = new Set<SubmissionStatus>(["approved", "rejected", "cancelled", "expired"]);

function derive(state: WorkflowState): WorkflowState {
  if (state.partyA.rejectedAt || state.partyB?.rejectedAt) {
    return { ...state, status: "rejected", locked: true };
  }
  if (state.approvalType === "none") {
    return { ...state, status: "approved", locked: true };
  }
  const a = Boolean(state.partyA.approvedAt);
  const needsB = state.approvalType === "dual";
  const b = needsB ? Boolean(state.partyB?.approvedAt) : true;
  if (a && b) return { ...state, status: "approved", locked: true };
  if (!needsB) return { ...state, status: "awaiting_party_a" };
  if (a && !b) return { ...state, status: "awaiting_party_b" };
  if (!a && b) return { ...state, status: "awaiting_party_a" };
  return { ...state, status: "awaiting_approvals" };
}

export function reduceWorkflow(state: WorkflowState, event: WorkflowEvent): WorkflowState {
  if (state.locked || terminal.has(state.status)) return state;

  if (event.type === "expire") return { ...state, status: "expired", locked: true };
  if (event.type === "cancel") return { ...state, status: "cancelled", locked: true };

  if (event.type === "submit") return derive(state);

  if (event.type === "approve") {
    if (event.party === "b") {
      if (!state.partyB) return state;
      return derive({
        ...state,
        partyB: { ...state.partyB, approvedAt: state.partyB.approvedAt ?? event.at },
      });
    }
    return derive({
      ...state,
      partyA: { ...state.partyA, approvedAt: state.partyA.approvedAt ?? event.at },
    });
  }

  if (event.party === "b") {
    if (!state.partyB) return state;
    return derive({
      ...state,
      partyB: {
        ...state.partyB,
        rejectedAt: event.at,
        rejectReason: event.reason,
      },
    });
  }
  return derive({
    ...state,
    partyA: {
      ...state.partyA,
      rejectedAt: event.at,
      rejectReason: event.reason,
    },
  });
}

export function shouldSendFinalConfirmation(previous: SubmissionStatus, next: SubmissionStatus) {
  return previous !== "approved" && next === "approved";
}

export function isFinal(status: SubmissionStatus) {
  return status === "approved";
}
