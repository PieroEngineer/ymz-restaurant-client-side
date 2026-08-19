import { useRef } from "react";
import { UseMenuDatasetQuery } from "@/features/menu/hooks/useMenuDatasetQuery";
import { useMenuSyncStatus } from "@/features/menu/hooks/useMenuSyncStatus";
import { useMenuDraft } from "@/features/menu/hooks/useMenuDraft";
import { useLocalPageMap } from "@/features/menu/hooks/useLocalPageMap";
import { useActivePage } from "@/features/menu/hooks/useActivePage";
import { useLocalPageFile } from "@/features/menu/hooks/useLocalPageFile";
import { useActiveEditCell } from "@/features/menu/hooks/useActiveEditCell";
import { useModalValidation } from "@/features/menu/hooks/useModalValidation";
import { usePinCoordinate } from "@/features/menu/hooks/usePinCoordinate";
import { PageChanger } from "@/features/menu/components/PageChanger";
import { MenuActionButton } from "@/features/menu/components/MenuActionButton";
import { ViewSelector } from "@/features/menu/components/ViewSelector";
import { MenuDisplay } from "@/features/menu/components/MenuDisplay";
import { SupportFrame } from "@/features/menu/components/SupportFrame";
import { DishChart } from "@/features/menu/components/DishChart";
import { MenuActionModal } from "@/features/menu/components/MenuValidationModal";
import { AddPageIcon } from "@/features/menu/components/icons/AddPageIcon";
import { UpdatePageIcon } from "@/features/menu/components/icons/UpdatePageIcon";
import { RemovePageIcon } from "@/features/menu/components/icons/RemovePageIcon";

export function MenuManagerPage() { // TODO: Apply "useCallBack" and "useMemo" where necessary

    // ===== ®️ Ref values =====

    // File input references for page upload/replace
    const addPagesInputRef = useRef<HTMLInputElement>(null);
    const replacePageInputRef = useRef<HTMLInputElement>(null);

    
    // ===== 🌐 Data Fetching & Mutations =====

    const { data: dbSnapshot, isLoading: isDownloading, isError: isErrorInDownload } = UseMenuDatasetQuery();

    // ===== 🔢 Page hooks =====

    // Handle the map that records the local pages
    const localPageMap = useLocalPageMap()
    
    // Control the cell which being edited
    const activeEditCell = useActiveEditCell()
    
    // Manage the local draft menu 
    const menuDraft = useMenuDraft(dbSnapshot, localPageMap.localPageFilesMap, localPageMap.onResetLocalImageMap)

    // Control the current active page
    const activePage = useActivePage(menuDraft.draftMenuPages)
    
    const localPageFile = useLocalPageFile(
        addPagesInputRef,
        replacePageInputRef,

        menuDraft.draftMenuPages, 
        activePage.activePageIndex,

        {   // For adding a new image
            onAddNewPages: menuDraft.onAddNewPages,
            onStackNewLocalImagesInMap: localPageMap.onStackNewLocalImagesInMap,
            onSetCurrentActivePageIndex: activePage.onSetCurrentActivePageIndex 
        },
        {   // For replacing a new image
          onReplaceLocalImageInMap: localPageMap.onReplaceLocalImageInMap,
          onReplacePage: menuDraft.onReplacePage
        },
        {   // For removing a new image
            onRemoveLocalImageFromMap: localPageMap.onRemoveLocalImageFromMap,
            onRemovePage: menuDraft.onRemovePage,
            onActivePageDeleted: activePage.onActivePageDeleted 
        },

        activeEditCell.onQuitActiveEditCell
    )

    // Compute sync status based on current draft and database state
    const syncStatus = useMenuSyncStatus(
        menuDraft.draftMenuPages,
        menuDraft.draftDishItems,
        menuDraft.isUploading,

        menuDraft.syncMenu,

        menuDraft.isErrorInUpload,
        isDownloading,
        isErrorInDownload,
    );

    // Manage the modal state
    const modalValidation = useModalValidation(
        menuDraft.draftMenuPages,
        menuDraft.draftDishItems,
        localPageFile.onCurrentImageRemove,
        menuDraft.onUploadMenu
    )

    // Control the pin coordinates
    const pinCoordinate = usePinCoordinate(
        activePage.currentActivePage, 
        
        menuDraft.onAddNewDish,
        menuDraft.onRemoveDish, 
        
        activeEditCell.onActivateEditCell,
        activeEditCell.onHandleSomeCellRemoved,
        
        menuDraft.onUpdateDishCoordinates
    );


    // ===== 🖼️User interface =====

    return (
        <div className="w-full h-full flex gap-6 items-stretch overflow-hidden bg-brand-background select-none px-4">
          <div className="w-30 flex flex-col gap-4 pt-20 pb-5 shrink-0 h-full items-center">
            <div className="flex-none w-3/4">
              <PageChanger
                currentPage={menuDraft.draftMenuPages.length > 0 ? activePage.activePageIndex + 1 : 0}
                totalPages={menuDraft.draftMenuPages.length}
                onPageUp={() => activePage.onGoToAdjacentPage(false)}
                onPageDown={() => activePage.onGoToAdjacentPage(true)}
              />
            </div>
    
            <hr className="w-full border-slate-200 my-1" />
    
            <MenuActionButton
              text="Añadir páginas"
              onClick={localPageFile.importNewLocalImage}
              icon={<AddPageIcon className="size-15" />}
            />
    
            <MenuActionButton
              text="Actualizar imagen"
              onClick={localPageFile.replaceWithLocalImage}
              disabled={menuDraft.draftMenuPages.length === 0}
              icon={<UpdatePageIcon className="size-15" />}
            />
    
            <MenuActionButton
              text="Borrar página"
              onClick={modalValidation.onConfirmDeletition}
              disabled={menuDraft.draftMenuPages.length === 0}
              icon={<RemovePageIcon className="size-15" />}
            />
    
            <input
              ref={addPagesInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={localPageFile.onLocalImageImported}
              className="hidden"
            />
    
            <input
              ref={replacePageInputRef}
              type="file"
              accept="image/*"
              onChange={localPageFile.onCurrentPageReplaced}
              className="hidden"
            />
          </div>
    
          <div className="flex-1 flex flex-col gap-2 pb-3 items-center h-screen min-w-[320px]">
            <div className="h-16 shrink-0 flex justify-center">
              <ViewSelector
                comingSoonCover={true}
                onToggleView={(mode) => console.log(`Inject code: Switch grid viewport profile to ${mode}`)}
              />
            </div>
    
            <div className="flex-1 min-h-0">
              <MenuDisplay
                activeImageSrc={activePage.currentActivePage ? activePage.currentActivePage.imageUrl : null}
                currentPageId={activePage.currentActivePage?.pageId ?? null}
                dishesWithNumbers={menuDraft.dishesWithOrder}
                onImagesUploaded={localPageFile.onLocalImageImported}
                onCoordinateAdded={pinCoordinate.onAddNewCoordinate}
                onCoordinateUpdated={pinCoordinate.onUpdateCoordinate}
                // onCoordinateDragStarted={pinCoordinate.onStartDrag}
                // onCoordinateDragCommitted={pinCoordinate.onCommitDrag}
                onCoordinateDeleted={pinCoordinate.onDeleteCoordinate}
                onTargetRowFocusRequested={activeEditCell.onActivateEditCell}
              />
            </div>
          </div>
    
          <div className="w-112.5 lg:w-130 flex flex-col items-stretch h-screen shrink-0">
            <div className="h-16 shrink-0 flex justify-center">
              <SupportFrame
                // onUndo={handlers.undo}   // TODO Retake it when undo & redo come back
                // onRedo={handlers.redo}
                // canUndo={canUndo}
                // canRedo={canRedo}
              />
            </div>
    
            <div className="flex-1 pb-4 pt-4 min-h-0">
              <DishChart
                items={menuDraft.dishesWithOrder}
                activeEditCell={activeEditCell.currentActiveEditCell}
                setActiveEditCell={activeEditCell.setActiveEditCell}    // TODO: Change this for "onQuitActiveEditCell" (existing) and "onGoToSpecificCell"
                onUpdateItem={menuDraft.onUpdateDishData}
                onRowClicked={activePage.onGoToSomePage}
                syncStatus={syncStatus}
                onSyncRequested={modalValidation.onAttemptSync}
              />
            </div>
          </div>
    
          <MenuActionModal
            isOpen={modalValidation.modalOpen}
            mode={modalValidation.modalMode}
            emptyPageNumbers={modalValidation.emptyPagesData}
            invalidDishes={modalValidation.invalidDishesData}
            activePageNumber={activePage.currentActivePage?.pageNumber}
            onClose={modalValidation.onCloseFrame}
            onProceedAnyway={modalValidation.onConfirmSync}
          />
        </div>
      );
}




    // ===== Dish State with Undo/Redo Support =====    // TODO: Implement it  
    //   const {
    //     value: dishes,
    //     setValue: setDishes,
    //     reset: resetDishes,
    //     undo: undoDishAction,
    //     redo: redoDishAction,
    //     canUndo,
    //     canRedo,
    //   } = useUndoableState<DishItem[]>(dbSnapshot?.dishes ?? [], { isEqual: areDishCollectionsEqual });  