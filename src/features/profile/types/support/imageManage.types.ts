export type RestaurantResourceTypes = 'LOGO' | 'QR' | 'FRONT1' | 'FRONT2' | 'FRONT3'

export interface ImageSource{
    url: string,
    file: File | null
}