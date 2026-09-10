import type { RestaurantResourceTypes as RestaurantImageResourceTypes } from "@/features/profile/types/support/imageManage.types";
import { useState } from "react";


export function useInteraction(
    addImageInputRef: React.RefObject<HTMLInputElement | null>,
) {

    const [isEditingName, setIsEditingName] = useState(false)
    const [resourceTypeToEdit, setResourceTypeToEdit] = useState<RestaurantImageResourceTypes | null>(null)

    return{
        isEditingName,
        
        toggleNameEdition: () => setIsEditingName((prev) =>!prev),

        navigateToMaps: (coordinates: [number, number]) => {
            coordinates
            ///Convert link into google maps link   /// https://www.google.com/maps/search/?api=1&query={lat},{lon}
            ///Trigger the opening of another tab with the link
        },

        imageToEdit: resourceTypeToEdit,

        importNewLocalImage: (imageType: RestaurantImageResourceTypes) => {
            setResourceTypeToEdit(imageType)
            addImageInputRef.current?.click()
        }

    }
}