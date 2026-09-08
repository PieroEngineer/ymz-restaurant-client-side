import type { Restaurant } from '@/features/profile/types/domain.types';
import { create } from 'zustand';

interface RestaurantState{
    restaurantInfo: Restaurant | null,
    setRestaurantInfo: (restaurant: Restaurant) => void
}

export const useCartStore = create<RestaurantState>((set) => ({
    restaurantInfo: null,

    setRestaurantInfo: (restaurant: Restaurant) => set({ restaurantInfo: restaurant})

}))