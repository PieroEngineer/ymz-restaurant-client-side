import { useState } from "react";
import type { MenuPage } from "@/features/menu/types/domain.types";


export function useActivePage(availableMenuPages: MenuPage[]) {
    const [activePageIndex, setActivePageIndex] = useState(0);
    
    return {
        currentActivePage: availableMenuPages[activePageIndex],

        activePageIndex,

        onSetCurrentActivePageIndex: (pageIndexToFocus: number) => setActivePageIndex(pageIndexToFocus), 

        onGoToAdjacentPage: (isForward: boolean) => {
            if(isForward){
                setActivePageIndex((prev) => (prev < availableMenuPages.length - 1 ? prev + 1 : prev));
            }
            else {
                setActivePageIndex((prev) => (prev > 0 ? prev - 1 : prev));   
            }
        },

        onGoToSomePage: (targetPageId: string) => {
            const targetIdx = availableMenuPages.findIndex((page) => page.pageId === targetPageId);
            if (targetIdx !== -1) setActivePageIndex(targetIdx);
        },

        onActivePageDeleted: () => setActivePageIndex((prevIndex) => {
            if (prevIndex === 0) return 0;
            if (prevIndex >= availableMenuPages.length - 1) return availableMenuPages.length - 2;
            return prevIndex;
        })
    }
}