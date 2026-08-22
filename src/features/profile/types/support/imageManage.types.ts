export type RestaurantImages = 'LOGO' | 'QR' | 'FRONT1' | 'FRONT2' | 'FRONT3'

export interface ImageSource{
    url: string,
    file: File | null
}