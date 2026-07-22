import type { TableRequest, TableRequestState } from '@/features/table-requests/types/domain.types';

export const updateTableRequestState = (
    requestId: string,
    newState: TableRequestState,
    requests?: TableRequest[],
): TableRequest[] =>

  (requests ?? []).map((request) =>
    request.requestId === requestId
      ? { ...request, state: newState }
      : request
  );