import type { UploadRestaurantInfoPayload } from "@/features/profile/types/api.types";
import type { Restaurant } from "@/features/profile/types/domain.types";

export function toRemoteRestaurant(
    local: Restaurant,
    logoWasModified: boolean,
    dishImagesWereModified: [boolean, boolean, boolean],
    qrWasModified: boolean
): UploadRestaurantInfoPayload {
    return {
        restaurantName: local.restaurantName,
        logoUrlRequired: logoWasModified,
        latitude: local.coordinates[0],
        longitude: local.coordinates[1],
        // openTime: local.openingTime,
        // closeTime: local.closingTime,
        dishesToShowUrlsRequired: dishImagesWereModified,
        phoneNumberToPay: local.peruvianPaymentNumber,
        phoneNumberToContact: local.peruvianContactNumber,
        paymentQrUrlsRequired: qrWasModified
    };
}