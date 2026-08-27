import type { CoordinatesSelectionMethodToken } from "@/features/profile/types/support/coordinates.type"
import { useState } from "react"


export function useLocationModal(

) {
    const [isSelecting, setIsSelecting] = useState(false)

    const [selectionMethod, setSelectionMethod] = useState<CoordinatesSelectionMethodToken>('G_MAPS_LINK')

    const selectMethod = (selectedMethod: CoordinatesSelectionMethodToken) => {
        setSelectionMethod(selectedMethod)
    }

    const toggleOpening = () => {
        setIsSelecting((prev) => !prev)
    }

    return {
        isOpen: isSelecting,

        selectionMethod,

        selectMethod,

        toggleOpening
    }

}
