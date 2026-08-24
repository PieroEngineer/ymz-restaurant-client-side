export interface Restaurant{
    restaurantId: string,
    restaurantName: string,
    logoUrl: string,
    logoFile: File | null,
    coordinates: [number, number],
    // openingTime: string,
    // closingTime: string,
    dishesToShowUrls: [string, string, string],
    dishesToShowFiles: [File | null, File | null, File | null],
    peruvianPaymentNumber: string,
    peruvianContactNumber: string,
    qrUrl: string,
    qrFile: File | null,
    //isOpen TODO
    isInitialized: boolean
}