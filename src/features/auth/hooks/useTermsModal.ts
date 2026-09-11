import { useState } from "react"


export function useTermsModal(

) {
    const [isOpen, setIsSelecting] = useState(false)

    const toggleOpening = () => {
        setIsSelecting((prev) => !prev)
    }

    return {
        isOpen,

        toggleOpening
    }

}