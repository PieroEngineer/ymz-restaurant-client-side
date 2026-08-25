import { formatPeruvianNumberWithCountryCode } from "@/features/profile/helpers/phoneNumberValidators";
import type { InitializeRestaurantInfoPayload, UpdateRestaurantInfoPayload } from "@/features/profile/types/api.types";
import type { Restaurant } from "@/features/profile/types/domain.types";

export function toRemoteRestaurantUpdate(
    local: Restaurant,
    logoWasModified: boolean,
    dishImagesWereModified: [boolean, boolean, boolean],
    qrWasModified: boolean
): UpdateRestaurantInfoPayload {
    return {
        restaurantName: local.restaurantName,
        logoUrlRequired: logoWasModified,
        latitude: local.coordinates[0],
        longitude: local.coordinates[1],
        // openTime: local.openingTime,
        // closeTime: local.closingTime,
        dishesToShowUrlsRequired: dishImagesWereModified,
        phoneNumberToPay: formatPeruvianNumberWithCountryCode(local.peruvianPaymentNumber),
        phoneNumberToContact: formatPeruvianNumberWithCountryCode(local.peruvianContactNumber),
        paymentQrUrlsRequired: qrWasModified
    };
}

export function toRemoteRestaurantInitialization(
    local: Restaurant,
    dishImagesWereModified: [boolean, boolean, boolean],
): InitializeRestaurantInfoPayload {
    return {
        restaurantName: local.restaurantName,
        latitude: local.coordinates[0],
        longitude: local.coordinates[1],
        // openTime: local.openingTime,
        // closeTime: local.closingTime,
        dishesToShowUrlsRequired: dishImagesWereModified,
        phoneNumberToPay: formatPeruvianNumberWithCountryCode(local.peruvianPaymentNumber),
        phoneNumberToContact: formatPeruvianNumberWithCountryCode(local.peruvianContactNumber),
    };
}