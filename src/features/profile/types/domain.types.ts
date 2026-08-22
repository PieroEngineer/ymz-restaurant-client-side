export interface Restaurant{
    restaurantId: string,
    restaurantName: string,
    logoUrl: string,
    coordinates: [number, number],
    // openingTime: string,
    // closingTime: string,
    dishesToShow: [string, string, string]
    peruvianPaymentNumber: string,
    peruvianContactNumber: string,
    qrUrl: string,
}