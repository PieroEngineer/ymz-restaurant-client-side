import type { RestaurantFilters } from "@/shared/types/filters.type";

export type RequestQueryKey = ['restaurant', 'active-requests', RestaurantFilters];

export type OrderQueryKey = ['restaurant', 'active-orders', RestaurantFilters];