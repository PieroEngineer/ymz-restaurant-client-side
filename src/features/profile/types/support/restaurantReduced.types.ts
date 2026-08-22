import type { Restaurant } from "@/features/profile/types/domain.types";

export type RestaurantStringRegularFields = Omit<Restaurant, "dishesToShow" | "coordinates" | "logoFile" | "dishesToShowFiles" | "qrFile">