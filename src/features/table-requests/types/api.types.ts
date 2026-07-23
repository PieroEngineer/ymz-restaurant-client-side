import type { TableRequestState } from "@/features/table-requests/types/domain.types";

// ===== Input Formats =====
export interface TableRequestPayload {
  requestId: string,
  userName: string,
  userId: string,
  groupSize: number,
  onQueuedTimestamp: number,
  state: TableRequestState,
  specifics: string[]
  arrivlaTime: number
  userDistance?: number,
  // TODO: Add the parameters that I include in TablePayload
}

export interface UpdateInfoPayload{
  requestId: string,
  newStatus: TableRequestState
}

// ===== Output Formats =====
export interface RequestUpdatePayload {
  userId: string,
  requestId: string,
  newState: TableRequestState
}

// ===== Response formats =====
export interface UpdatingRequestStatusResponse {
  message: string
}