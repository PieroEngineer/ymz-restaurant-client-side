export type TableRequestState = 'QUEUED' | 'ACCEPTED' | 'PAY_TRIED' |  'READY' | 'PAID';

//  export type OrderState = 'PRESELECTED' | 'PAID'; // TODO: Later, remove "PAID" from "TableRequestState" and implement "OrderState"

export interface TableRequest {
  requestId: string,
  userName: string,
  userId: string,
  groupSize: number,
  onQueuedTimestamp: number,
  state: TableRequestState,
  specifics: string[],
  arrivlaTime: number
  userDistance?: number

  /*  TODO
  isAboutToPay: boolean,
  userDistance: number,
  onAcceptedTimestamp: number,
  onReadyTimestamp,: number 
  onPaidTimestam: numberp
  */

  /// Maybe the userId should be added
}

export interface Order {
  requestId: string,
  userId: string,
  userName: string,
  // lastUpdateTimestamp: number,
  arrivalTimeInMinutes: number,
  groupSize: number,
  totalCostInCents: number,
  // currentDistanceInMeters: number,   // TODO
  onPaidTimeStamp: number,
  customerArrived: boolean,
  orderSelections: OrderItem[],
  paymentImageUrl: string
}
export interface OrderItem {
  dishId: string,
  dishName: string,
  quantity: number,
  complementaryDishId: string,
  historicalUnitPriceInCents: number
}