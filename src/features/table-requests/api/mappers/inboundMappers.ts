import type { TableRequestPayload } from "@/features/table-requests/types/api.types";
import type { TableRequest } from "@/features/table-requests/types/domain.types";

export function toDomainTableRequest(dto: TableRequestPayload): TableRequest {
    return {
        requestId: dto.requestId,
        userName: dto.userName,
        groupSize: dto.groupSize,
        onQueuedTimestamp: dto.onQueuedTimestamp,
        state: dto.state,
        specifics: dto.specifics,
        arrivlaTime: dto.arrivlaTime,
        userDistance: dto.userDistance,
        userId: dto.userId
    }
}