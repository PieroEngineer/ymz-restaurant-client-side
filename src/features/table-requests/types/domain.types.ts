export type TableRequestState = 'QUEUED' | 'ACCEPTED' | 'READY' | 'PAID';

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