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

export interface OrderPreselectionPayload{
  requestId: string,
  userId: string,
  userName: string,
  // lastUpdateTimestamp: number,
  arrivalTimeInMinutes: number,
  groupSize: number,
  totalCostInCents: number,
  // currentDistanceInMeters: number,   // TODO
  onPaidTimeStamp: number,
  // customerArrived: Boolean,
  orderSelections: OrderItemPayload[]
}
interface OrderItemPayload{
  dishId: string
  dishName: string,
  quantity: number
  historicalUnitPriceInCents: number
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