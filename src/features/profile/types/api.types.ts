// ===== Input Formats =====

export interface GetRestaurantInfoResponse{
    restaurantId: string,
    restaurantName: string,
    logoUrl: string,
    latitude: number,
    longitude: number,
    // openTime: string,
    // closeTime: string,
    dishesToShowUrls: [string, string, string],
    phoneNumberToPay: string,
    phoneNumberToContact: string,
    paymentQrUrl: string
}

export interface UploadRestaurantInfoResponse{
    logoPresignedUrl: string,
    dishesToShowPresignedUrls: [string, string, string],
    paymentQrPresignedUrl: string,
}

// ===== Output Formats =====

export interface UploadRestaurantInfoPayload{   // TODO: For now we send all the data because the restaurant data doesn't change frequently, but later use the specific fields logic  
    restaurantName: string,
    logoUrlRequired: boolean,
    latitude: number,
    longitude: number,
    // openTime: string,
    // closeTime: string,
    dishesToShowUrlsRequired: [boolean, boolean, boolean],
    phoneNumberToPay: string,
    phoneNumberToContact: string,
    paymentQrUrlsRequired: boolean
}