import type { TableRequestState } from "@/features/table-requests/types/domain.types";

export interface CardInfoItem {
    nomination: string;
    value: string;
}

export type UpdateStatusVariables = {
  requestId: string;
  newState: TableRequestState;
};
