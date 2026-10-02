import type { TableRequestState } from "@/features/table-requests/types/domain.types";

export interface CardInfoItem {
    nomination: string;
    value: string;
}

export interface UpdateStatusAttributes {
  requestId: string;
  newState: TableRequestState;
};

export interface CancelRequestAttributes { 
  requestId: string;
}

export interface DetailsUiModel {
  paymentImageUrl: string
  extraCommentaries: string
}

export type TabSelectionToken = 'PAYMENT' | 'COMMENTARIES'