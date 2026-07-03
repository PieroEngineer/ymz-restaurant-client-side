import { PageChanger } from '@/features/menu/components/PageChanger';
import { ViewSelector } from '@/features/menu/components/ViewSelector';
import { MenuActionButton } from '@/features/menu/components/MenuActionButton';
import { MenuDisplay } from '@/features/menu/components/MenuDisplay';
import { SupportFrame } from '@/features/menu/components/SupportFrame';
import { DishChart } from '@/features/menu/components/DishChart';

import { AddPageIcon } from '@/features/menu/components/icons/AddPageIcon';
import { RemovePageIcon } from '@/features/menu/components/icons/RemovePageIcon';
import { UpdatePageIcon } from '@/features/menu/components/icons/UpdatePageIcon';

import { useMenuEditor } from '@/features/menu/hooks/useMenuEditor';
import { MenuActionModal } from '@/features/menu/components/MenuValidationModal';

export function MenuManagerPage() {
  const {
    menuPages,
    activePageIndex,
    activePageObject,
    computedDishesDataset,
    activeEditCell,
    setActiveEditCell,
    syncStatus,
    canUndo,
    canRedo,
    addPagesInputRef,
    replacePageInputRef,
    modal,
    handlers,
  } = useMenuEditor();

  return (
    <div className="w-full h-full flex gap-6 items-stretch overflow-hidden bg-brand-background select-none px-4">
      <div className="w-30 flex flex-col gap-4 pt-20 pb-5 shrink-0 h-full items-center">
        <div className="flex-none w-3/4">
          <PageChanger
            currentPage={menuPages.length > 0 ? activePageIndex + 1 : 0}
            totalPages={menuPages.length}
            onPageUp={handlers.pagePrevious}
            onPageDown={handlers.pageNext}
          />
        </div>

        <hr className="w-full border-slate-200 my-1" />

        <MenuActionButton
          text="Añadir páginas"
          onClick={handlers.openAddPages}
          icon={<AddPageIcon className="size-15" />}
        />

        <MenuActionButton
          text="Actualizar imagen"
          onClick={handlers.openReplacePage}
          disabled={menuPages.length === 0}
          icon={<UpdatePageIcon className="size-15" />}
        />

        <MenuActionButton
          text="Borrar página"
          onClick={handlers.triggerDeleteConfirmation}
          disabled={menuPages.length === 0}
          icon={<RemovePageIcon className="size-15" />}
        />

        <input
          ref={addPagesInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handlers.uploadLocalFiles}
          className="hidden"
        />

        <input
          ref={replacePageInputRef}
          type="file"
          accept="image/*"
          onChange={handlers.replaceCurrentPageImage}
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
            activeImageSrc={activePageObject ? activePageObject.imageUrl : null}
            currentPageId={activePageObject?.pageId ?? null}
            dishesWithNumbers={computedDishesDataset}
            onImagesUploaded={handlers.uploadLocalFiles}
            onCoordinateAdded={handlers.addCoordinatePin}
            onCoordinateUpdated={handlers.updateCoordinatePosition}
            onCoordinateDragStarted={handlers.startCoordinateDrag}
            onCoordinateDragCommitted={handlers.commitCoordinateDrag}
            onCoordinateDeleted={handlers.deleteCoordinateRecord}
            onTargetRowFocusRequested={handlers.requestRowFocus}
          />
        </div>
      </div>

      <div className="w-112.5 lg:w-130 flex flex-col items-stretch h-screen shrink-0">
        <div className="h-16 shrink-0 flex justify-center">
          <SupportFrame
            onUndo={handlers.undo}
            onRedo={handlers.redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>

        <div className="flex-1 pb-4 pt-4 min-h-0">
          <DishChart
            items={computedDishesDataset}
            activeEditCell={activeEditCell}
            setActiveEditCell={setActiveEditCell}
            onUpdateItem={handlers.updateDishDataField}
            onRowClicked={handlers.syncCanvasToRowPage}
            syncStatus={syncStatus}
            onSyncRequested={handlers.triggerSyncValidation}
          />
        </div>
      </div>

      <MenuActionModal
        isOpen={modal.isOpen}
        mode={modal.mode}
        emptyPageNumbers={modal.emptyPageNumbers}
        invalidDishes={modal.invalidDishes}
        activePageNumber={modal.activePageNumber}
        onClose={modal.close}
        onProceedAnyway={modal.onProceed}
      />
    </div>
  );
}
