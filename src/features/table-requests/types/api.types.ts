import type { TableRequestState } from "@/features/table-requests/types/domain.types";

// ===== Input Formats =====
export interface TableRequestPayload {
  requestId: string,
  userId: string,
  userName: string,
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
  orderId: string,
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
  orderSelections: OrderItemPayload[],
  paymentImageUrl: string
  extraCommentaries: string
}
interface OrderItemPayload{
  dishId: string,
  dishName: string,
  quantity: number,
  complementaryDishId: string,
  historicalUnitPriceInCents: number
}

export interface FinalizeOrderPayload{
  restaurantId: string,
  orderId: string
}

export interface CancelRequestPayload {
  requestId: string
}

// ===== Output Formats =====
export interface RequestUpdatePayload {
  userId: string,
  requestId: string,
  newState: TableRequestState
}

export interface DenyRequestPayload {
  userId: string,
  restaurantId: string,  // TODO: The restaurant ID should be passed later for all the requests because the backend can identify who is doing the request and associate it with the cognito key
  actor: String
}

// ===== Response formats =====
export interface UpdatingRequestStatusResponse {
  message: string
  onUpdateRequestStateTimestamp: number
}