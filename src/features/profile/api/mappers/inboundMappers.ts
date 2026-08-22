import type { GetRestaurantInfoResponse } from "@/features/profile/types/api.types";
import type { Restaurant } from "@/features/profile/types/domain.types";


export function toDomainRestaurant(dto: GetRestaurantInfoResponse): Restaurant {
    return {
        restaurantId: dto.restaurantId,
        restaurantName: dto.restaurantName,
        logoUrl: dto.logoUrl,
        logoFile: null,
        coordinates: [dto.latitude, dto.longitude],
        // openingTime: dto.openingTime,    // TODO: It's going to need the free tier of "Amazon EventBridge Scheduler". A good idea to save eschedules is force restaurants to open at "... :00" and "... :30", so the schedule just check in that times what restaurants should be toggled.
        // closingTime: dto.closingTime,
        dishesToShowUrls: dto.dishesToShowUrls,
        dishesToShowFiles: [null, null, null],
        peruvianPaymentNumber: dto.phoneNumberToPay,
        peruvianContactNumber: dto.phoneNumberToContact,
        qrUrl: dto.paymentQrUrl,
        qrFile: null
    }
}