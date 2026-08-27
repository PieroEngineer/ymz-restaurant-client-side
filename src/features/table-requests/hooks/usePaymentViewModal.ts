import { useState } from "react"


export function usePaymentViewModal(

) {
    const [isOpen, setIsSelecting] = useState(false)
    const [observedPaymentUrl, setObservedPaymentUrl] = useState<string | null>(null)

    const toggleOpening = () => {
        setIsSelecting((prev) => !prev)
    }

    return {
        observedPaymentUrl,

        setObservedPaymentUrl,

        isOpen,

        toggleOpening
    }

}