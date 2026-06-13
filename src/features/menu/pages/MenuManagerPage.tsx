import { type ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { PageChanger } from '@/features/menu/components/PageChanger';
import { ViewSelector } from '@/features/menu/components/ViewSelector';
import { MenuActionButton } from '@/features/menu/components/MenuActionButton';
import { MenuDisplay } from '@/features/menu/components/MenuDisplay';
import { SupportFrame } from '@/features/menu/components/SupportFrame';
import { DishChart } from '@/features/menu/components/DishChart';
import { ArrowIcon } from '@/features/menu/components/icons/ArrowIcon';
import { useUndoableState } from '@/features/menu/hooks/useUndoableState';
import type { MenuPage, DishItem } from '@/features/menu/types/sync.types';
import { useMenuSync } from '@/features/menu/hooks/useMenuSync';

type EditableDishField = 'name' | 'cost' | 'prepTime';

const createMenuImageUrls = (files: FileList | null) => {
  return Array.from(files || []).map((file) => URL.createObjectURL(file));
};

const areDishCollectionsEqual = (left: DishItem[], right: DishItem[]) => {
  if (left.length !== right.length) return false;

  return left.every((leftDish, index) => {
    const rightDish = right[index];

    return (
      leftDish.id === rightDish.id &&
      leftDish.pageId === rightDish.pageId &&
      leftDish.xPercent === rightDish.xPercent &&
      leftDish.yPercent === rightDish.yPercent &&
      leftDish.name === rightDish.name &&
      leftDish.cost === rightDish.cost &&
      leftDish.prepTime === rightDish.prepTime &&
      leftDish.createdAt === rightDish.createdAt
    );
  });
};

export function MenuManagerPage() { 
  // FDD State Layer Matrix Storage Units
  const [menuPages, setMenuPages] = useState<MenuPage[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  //X const [menuPages, setMenuPages] = useState<string[]>([]);
    
  // 💾 Master FDD Data Storage Unit for all interactive items
  const {
    value: dishes,
    setValue: setDishes,
    reset: resetDishesHistory,
    undo: undoDishAction,
    redo: redoDishAction,
    canUndo,
    canRedo,
  } = useUndoableState<DishItem[]>([], { isEqual: areDishCollectionsEqual });
  
  // 🔌 Selection tracker across input component frames
  const [activeEditCell, setActiveEditCell] = useState<{ id: string; field: EditableDishField } | null>(null);
  const addPagesInputRef = useRef<HTMLInputElement>(null);
  const dragHistoryBaseRef = useRef<DishItem[] | null>(null);

  const handleUndoDishAction = useCallback(() => {
    undoDishAction();
    setActiveEditCell(null);
  }, [undoDishAction]);

  const handleRedoDishAction = useCallback(() => {
    redoDishAction();
    setActiveEditCell(null);
  }, [redoDishAction]);

  useEffect(() => {
    const handleKeyboardHistoryCommand = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (!event.ctrlKey) return;

      if (key === 'z') {
        event.preventDefault();
        handleUndoDishAction();
      }

      if (key === 'y') {
        event.preventDefault();
        handleRedoDishAction();
      }
    };

    window.addEventListener('keydown', handleKeyboardHistoryCommand);
    return () => window.removeEventListener('keydown', handleKeyboardHistoryCommand);
  }, [handleRedoDishAction, handleUndoDishAction]);

   // 🔌 Data Sync Integration Pipe Engine Connections
  const handleDatabaseInitCallback = (initialPages: MenuPage[], initialDishes: DishItem[]) => {
    setMenuPages(initialPages);
    setDishes(initialDishes);
    setActivePageIndex(0);
  };

  const { syncStatus, synchronizeDatasetChanges } = useMenuSync(
    menuPages,
    dishes,
    handleDatabaseInitCallback
  );

  const activePageObject = menuPages[activePageIndex];

  // Logic handlers for tracking horizontal menu layout page indexing operations
  const handlePageNext = () => {
    if (activePageIndex < menuPages.length - 1) setActivePageIndex((prev) => prev + 1);
  };

  const handlePagePrevious = () => {
    if (activePageIndex > 0) setActivePageIndex((prev) => prev - 1);
  };

  const handleOpenAddPages = () => {
    addPagesInputRef.current?.click();
  };

  const handleUpdatePages = () => {
    // TODO: implement page update behavior
  };

  const handleRemovePages = () => {
    // TODO: implement page removal behavior
  };

  const handleOpenLabels = () => {
    // TODO: implement label management behavior
  };

  const handleUploadedLocalFilesPipeline = (event: ChangeEvent<HTMLInputElement>) => { /// For the local upload of image in the Menu display 
    const { files } = event.target;
    
    if (files && files.length > 0) {
      // Transform the urls 
      const transformedNewPages: MenuPage[] = createMenuImageUrls(files).map((url, index) => ({ //TODO: Convert this transformer into a function
        pageId: crypto.randomUUID(),  //TODO: Here is ok that a new UUID is generated because it's a new image, but later pass the UUID generation to the backend
        imageUrl: url,
        pageNumber: index + 1
      }));
  
      if (transformedNewPages.length === 0) return;
  
      setMenuPages((prev) => [...prev || [], ...transformedNewPages]);
  
      setActivePageIndex(menuPages.length);
      resetDishesHistory([]); // Wipe previous data frames for fresh uploads
      setActiveEditCell(null);
      dragHistoryBaseRef.current = null;
  
      //XsetDishes([]);  /// Does it remove all dishes when a new image is uploaded?
  
      event.target.value = '';
    }
  };

  // 🧮 LOGIC ENGINE: Dynamic multi-tier sorting model calculation
  // Resilient to page adjustments, tracking spatial coordinates and tie-breaker stamps
  const getSortedDishesWithNumbers = (): (DishItem & { orderNumber: number })[] => {
    return [...dishes]
      .sort((a, b) => {
        const pageA = menuPages.find(p => p.pageId === a.pageId)?.pageNumber || 0;
        const pageB = menuPages.find(p => p.pageId === b.pageId)?.pageNumber || 0;
        if (pageA !== pageB) return pageA - pageB;
        if (a.yPercent !== b.yPercent) return a.yPercent - b.yPercent;

        // Tie-Breaker sorting by exact creation timestamp
        return a.createdAt - b.createdAt;
      })
      .map((dish, index) => ({
        ...dish,
        orderNumber: index + 1 // 🔢 Output number derived dynamically based on current sorted array index
      }));
  };

  // 🎯 LOGIC: Intercept canvas clicks and auto-focus the new row's name field
  const handleAddNewCoordinatePin = (coords: Omit<DishItem, 'id' | 'pageId' | 'name' | 'cost' | 'prepTime' | 'createdAt' | 'imageUrl'>) => {
    if (!activePageObject) return;

    const newId = crypto.randomUUID();
    const newDishRecord: DishItem = {
      ...coords,
      id: newId,
      pageId: activePageObject.pageId,
      imageUrl: '',
      name: '',
      cost: '',
      prepTime: '',
      createdAt: Date.now() // ⏳ Stamp execution timestamp for sorting precision
    };

    setDishes((prev) => [...prev, newDishRecord]);
    
    // ⚡ Feature: Instantly focus the Name input field of the newly created item row
    setActiveEditCell({ id: newId, field: 'name' });
  };

    // 🚀 Logic: Dynamic adjustment of coordinates while dragging across the image matrix canvas
  const handleStartCoordinateDrag = useCallback(() => {
    dragHistoryBaseRef.current = dishes;
  }, [dishes]);

  const handleUpdateCoordinatePosition = (id: string, xPercent: number, yPercent: number) => {
    setDishes(
      (prev) => prev.map((dish) => (dish.id === id ? { ...dish, xPercent, yPercent } : dish)),
      { record: false }
    );
  };

  const handleCommitCoordinateDrag = () => {
    if (!dragHistoryBaseRef.current) return;

    setDishes((current) => current, { historyBase: dragHistoryBaseRef.current });
    dragHistoryBaseRef.current = null;
  };

  // 🧹 Logic: Erase marker pin item record and clear related lines out of the grid layout
  const handleDeleteCoordinateRecord = (id: string) => {
    setDishes((prev) => prev.filter((dish) => dish.id !== id));
    if (activeEditCell?.id === id) setActiveEditCell(null);
  };

  // 📝 LOGIC: Handle live data edits across inline cells
  const handleUpdateDishDataField = (id: string, field: EditableDishField, value: string) => {
    setDishes((prev) => 
      prev.map((dish) => (dish.id === id ? { ...dish, [field]: value } : dish))
    );
  };

  // 🧭 Logic: Sync active canvas viewport to match a selected table item's page index
  const handleSyncCanvasToRowPage = (targetPageId: string) => {
    const targetIdx = menuPages.findIndex(p => p.pageId === targetPageId);
    if (targetIdx !== -1) setActivePageIndex(targetIdx);
  };

  // 👁️ Logic: Shift selection to target name input row field
  const handleRequestRowFocus = (id: string) => {
    setActiveEditCell({ id, field: 'name' });
  };

  // Run the data array compilation engine
  const computedDishesDataset = getSortedDishesWithNumbers();

  // console.log('🔎  activePageObject', activePageObject)

  return (
    <div className="w-full h-full flex gap-6 items-stretch overflow-hidden bg-brand-background select-none px-4">
      <input
        ref={addPagesInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleUploadedLocalFilesPipeline}
        className="hidden"
      />
      
      {/* COLUMN 1: LEFT COMPACT OPERATIONS COLUMN (Sits below sidebar action zone footprint) */}
      <div className="w-30 flex flex-col gap-4 pt-20 pb-5 shrink-0 h-full items-center">
        
        <div className = "flex-none w-3/4">
          {/* Component 1: Page Changer */}
          <PageChanger 
            currentPage={menuPages.length > 0 ? activePageIndex + 1 : 0}
            totalPages={menuPages.length}
            onPageUp={handlePagePrevious}
            onPageDown={handlePageNext}
          />
        </div>
        
        <MenuActionButton
          text="Añadir"
          onClick={handleOpenAddPages}
          icon={<ArrowIcon className="size-5" />}
        />

        <MenuActionButton
          text="Actualizar"
          onClick={handleUpdatePages}
          icon={<ArrowIcon className="size-5" />}
        />

        <MenuActionButton
          text="Borrar"
          onClick={handleRemovePages}
          icon={<ArrowIcon className="size-5" />}
        />

        <MenuActionButton
          text="Etiquetas"
          onClick={handleOpenLabels}
          comingSoonCover = {true}
          icon={<ArrowIcon className="size-5" />}
        />
      </div>

      {/* COLUMN 2: CENTRAL INTERACTIVE VIEWPORT COLUMN */}
      <div className="flex-1 flex flex-col gap-2 pb-3 items-center h-screen min-w-[320px]">
        {/* Component 3: View Selector (Touches extreme top bounds) */}
        <div className="h-16 shrink-0 flex justify-center">
          <ViewSelector // TODO: Move it to the right of the Menu display and become it vertical
            onToggleView={(mode) => console.log(`Inject code: Switch grid viewport profile to ${mode}`)}
          />
        </div>
        {/* Component 4: Dynamic Interactive Menu Display Context */}
        {/** <div className="h-[90%]">  It worked previously, is it a bad practices? */}
        <div className="flex-1 min-h-0">
          <MenuDisplay 
            activeImageSrc={activePageObject ? activePageObject.imageUrl : null}
            currentPageId={activePageObject?.pageId ?? null}
            dishesWithNumbers={computedDishesDataset} // 🔌 Passing live dataset with computed numbers
            onImagesUploaded={handleUploadedLocalFilesPipeline}
            onCoordinateAdded={handleAddNewCoordinatePin}
            /* 🔌 Added interactive handlers */
            onCoordinateUpdated={handleUpdateCoordinatePosition}
            onCoordinateDragStarted={handleStartCoordinateDrag}
            onCoordinateDragCommitted={handleCommitCoordinateDrag}
            onCoordinateDeleted={handleDeleteCoordinateRecord}
            /* 🔌 Actions connection string parameter */
            onTargetRowFocusRequested={handleRequestRowFocus}
          />
        </div>
      </div>

      {/* COLUMN 3: RIGHT ANALYTICS & RECTIFICATION DATA COLUMN */}
      <div className="w-112.5 lg:w-130 flex flex-col items-stretch h-screen shrink-0">
        {/* Component 5: Support Frame (Touches extreme top bounds) */}
        <div className="h-16 shrink-0 flex justify-center">
          <SupportFrame 
            onUndo={handleUndoDishAction}
            onRedo={handleRedoDishAction}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>
        {/* Component 6: Dish Chart Data Table Matrix Grid Wrapper */}
        <div className="flex-1 pb-4 pt-4 min-h-0">
          {/* 📊 Integrated Inline Editable Grid Table */}
          <DishChart 
            items={computedDishesDataset}
            activeEditCell={activeEditCell}
            setActiveEditCell={setActiveEditCell}
            onUpdateItem={handleUpdateDishDataField}
            /* 🔌 Added sync listener hooks */
            onRowClicked={handleSyncCanvasToRowPage}
              /* 🔌 Added sync properties */
            syncStatus={syncStatus}
            onSyncRequested={synchronizeDatasetChanges}
          />
        </div>
      </div>

    </div>
  );
}
