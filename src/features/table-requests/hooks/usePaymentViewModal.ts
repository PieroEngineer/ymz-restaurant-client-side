import type { DetailsUiModel, TabSelectionToken } from "@/features/table-requests/types/support/cardFields.types"
import { useState } from "react"


export function useDetailsModal(

) {
    const [isOpen, setIsSelecting] = useState(false)
    const [selectedTab, setSelectedTab] = useState<TabSelectionToken>('PAYMENT')
    const [details, setDetails] = useState<DetailsUiModel |null>(null)

    // const [observedPaymentUrl, setObservedPaymentUrl] = useState<string | null>(null)

    const toggleOpening = () => {
        setIsSelecting((prev) => !prev)
    }

    const onSelectTab = (tab: TabSelectionToken) => {
        setSelectedTab(tab)
    }

    return {

        details,

        setDetails,

        isOpen,

        toggleOpening,

        selectedTab,

        onSelectTab
    }

}