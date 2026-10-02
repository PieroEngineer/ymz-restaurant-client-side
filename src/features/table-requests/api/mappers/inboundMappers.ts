import type { OrderPreselectionPayload, TableRequestPayload } from "@/features/table-requests/types/api.types";
import type { Order, TableRequest } from "@/features/table-requests/types/domain.types";

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

export function toDomainOrder(dto: OrderPreselectionPayload): Order {
    return {
        orderId: dto.orderId,
        userId: dto.userId,
        requestId: dto.requestId,
        userName: dto.userName,
        // lastUpdateTimestamp: dto.lastUpdateTimestamp,
        arrivalTimeInMinutes: dto.arrivalTimeInMinutes,
        groupSize: dto.groupSize,
        totalCostInCents: dto.totalCostInCents,
        customerArrived: false, /// This is a local indicator but later convert it into a real time check with some efficient logic to optimize sending.
        onPaidTimeStamp: dto.onPaidTimeStamp,
        orderSelections: dto.orderSelections.map((selection) => ({
            dishId: selection.dishId,
            dishName: selection.dishName,
            quantity: selection.quantity,
            complementaryDishId: selection.complementaryDishId,
            historicalUnitPriceInCents: selection.historicalUnitPriceInCents,
        })),
        paymentImageUrl: dto.paymentImageUrl,
        extraCommentaries: dto.extraCommentaries
    };
}