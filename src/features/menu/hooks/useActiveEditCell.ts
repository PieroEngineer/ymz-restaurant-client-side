import { useState } from "react";
import type { ActiveEditCell } from "@/features/menu/types/support/selection.types";


export function useActiveEditCell(){
    const [currentActiveEditCell, setActiveEditCell] = useState<ActiveEditCell | null>(null);

    return {
        currentActiveEditCell,
        setActiveEditCell,
        onQuitActiveEditCell: () => setActiveEditCell(null),
        onActivateEditCell: (focusedId: string) =>  setActiveEditCell({ id: focusedId, field: 'name' }),
        onHandleSomeCellRemoved: (removedId: string) => setActiveEditCell((current) => (current?.id === removedId ? null : current))
    }
}