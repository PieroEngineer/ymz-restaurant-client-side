import { formatPeruvianNumberWithCountryCode } from "@/features/profile/helpers/phoneNumberValidators";
import type { InitializeRestaurantInfoPayload, UpdateRestaurantInfoPayload } from "@/features/profile/types/api.types";
import type { Restaurant } from "@/features/profile/types/domain.types";

export function toRemoteRestaurantUpdate(
    local: Restaurant,
    modifiedLogoImageUrl: string,
    modifiedDishImageUrls: [string, string, string],
    modifiedQrImageUrl: string
): UpdateRestaurantInfoPayload {
    return {
        restaurantName: local.restaurantName,
        logoUrl: modifiedLogoImageUrl,
        latitude: local.coordinates[0],
        longitude: local.coordinates[1],
        // openTime: local.openingTime,
        // closeTime: local.closingTime,
        dishesToShowUrls: modifiedDishImageUrls,
        phoneNumberToPay: formatPeruvianNumberWithCountryCode(local.peruvianPaymentNumber),
        phoneNumberToContact: formatPeruvianNumberWithCountryCode(local.peruvianContactNumber),
        paymentQrUrl: modifiedQrImageUrl
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