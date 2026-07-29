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

export const removeTableRequest = (
    requestId: string,
    requests?: TableRequest[],
): TableRequest[] =>
  (requests ?? []).filter((request) => request.requestId !== requestId);