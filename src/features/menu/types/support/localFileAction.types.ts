import type { MenuPage } from "@/features/menu/types/domain.types";

export interface ImportActions {
    onAddNewPages: (newPages: MenuPage[]) => void;
    onStackNewLocalImagesInMap: (newFileEntries: Record<string, File>) => void;
    onSetCurrentActivePageIndex: (pageIndexToFocus: number) => void;
}

export interface ReplaceActions {
    onReplaceLocalImageInMap: (targetPageId: string, targetFile: File) => void;
    onReplacePage: (targetPageId: string, newLocalUrl: string) => void;
}

export interface RemoveActions {
    onRemoveLocalImageFromMap: (pageIdToDestroy: string) => void;
    onRemovePage: (pageIdToDestroy: string) => void;
    onActivePageDeleted: () => void;
}