export type TableRequestType = 'QUEUED' | 'ACCEPTED' | 'PAID';

export interface InfoItem {
  label: string;
  value: string;
}

export interface TableRequestPayload {
  requestId: string;
  title: string;          // e.g., "Mesa 4" or "Request #102"
  type: TableRequestType;
  createdAt: string;      // ISO String timestamp from backend
  referenceTimeMinutes: number; // Parsed minutes computed relative to now
  info: InfoItem[];
  statusText?: string;    // Conditional subtext
}