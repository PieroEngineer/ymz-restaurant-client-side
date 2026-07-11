import type { MenuPage } from "@/features/menu/types/domain.types";
import { fromFilesToMenuPages } from "@/features/menu/helpers/mappers/fileMappers";
import type { ImportActions, RemoveActions, ReplaceActions } from "@/features/menu/types/support/localFileAction.types";

export function useLocalPageFile(
    addPagesInputRef: React.RefObject<HTMLInputElement | null>,
    replacePageInputRef: React.RefObject<HTMLInputElement | null>,

    menuPages: MenuPage[], 
    activePageIndex: number,

    importActions: ImportActions,
    replaceActions: ReplaceActions,
    removeActions: RemoveActions,

    onQuitActiveEditCell: () => void
) 
{
    const importNewLocalImage = () => addPagesInputRef.current?.click()

    const replaceWithLocalImage = () => {
        if (menuPages.length === 0) return;
        replacePageInputRef.current?.click();
    }

    const onLocalImageImported = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        if (!files || files.length === 0) return;

        const newFileEntries: Record<string, File> = {};
        const existingPageCount = menuPages.length;

        // Create page objects with blob URLs for preview
        const newPages =  fromFilesToMenuPages(files, existingPageCount)

        if (newPages.length === 0) return;

        importActions.onAddNewPages(newPages);
        importActions.onStackNewLocalImagesInMap(newFileEntries);
        importActions.onSetCurrentActivePageIndex(existingPageCount);

        onQuitActiveEditCell();
        event.target.value = '';
    }

    const onCurrentImageRemove = () => {
        if (menuPages.length === 0) return;

        const pageToDestroy = menuPages[activePageIndex];
        const pageIdToDestroy = pageToDestroy.pageId;

        removeActions.onRemoveLocalImageFromMap(pageIdToDestroy);
        removeActions.onRemovePage(pageIdToDestroy);
        removeActions.onActivePageDeleted();

        onQuitActiveEditCell();
    }

    const onCurrentPageReplaced = (event: React.ChangeEvent<HTMLInputElement>) => {    // TODO: Change it to receive the file, not the event
        const { files } = event.target;
        if (!files || files.length === 0) return;

        const targetFile = files[0];
        const targetPage = menuPages[activePageIndex];
        if (!targetPage) return;

        const targetPageId = targetPage.pageId;

        replaceActions.onReplaceLocalImageInMap(targetPageId, targetFile);
        replaceActions.onReplacePage(targetPageId, URL.createObjectURL(targetFile))

        event.target.value = '';
    }

    return {
        importNewLocalImage,
        
        replaceWithLocalImage,
        
        onLocalImageImported,

        onCurrentPageReplaced,

        onCurrentImageRemove,
    }
}