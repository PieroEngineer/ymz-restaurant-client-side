import { useState } from 'react';

import { PageChanger } from '@/features/menu/components/PageChanger';
import { ViewSelector } from '@/features/menu/components/ViewSelector';
import { MenuDisplay, type DishItem } from '@/features/menu/components/MenuDisplay';
import { SupportFrame } from '@/features/menu/components/SupportFrame';
import { DishChart } from '@/features/menu/components/DishChart';


export function MenuManagerPage() {
  // FDD State Layer Matrix Storage Units
  const [uploadedMenuImages, setUploadedMenuImages] = useState<string[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
    
  // 💾 Master FDD Data Storage Unit for all interactive items
  const [dishes, setDishes] = useState<DishItem[]>([]);
  
  // 🔌 Selection tracker across input component frames
  const [activeEditCell, setActiveEditCell] = useState<{ id: string; field: 'name' | 'cost' | 'prepTime' } | null>(null);

  // Logic handlers for tracking horizontal menu layout page indexing operations
  const handlePageNext = () => {
    if (activePageIndex < uploadedMenuImages.length - 1) {
      setActivePageIndex((prev) => prev + 1);
    }
  };

  const handlePagePrevious = () => {
    if (activePageIndex > 0) {
      setActivePageIndex((prev) => prev - 1);
    }
  };

  
  const handleUploadedFilesPipeline = (urls: string[]) => {
    setUploadedMenuImages(urls);
    setActivePageIndex(0);
    setDishes([]); // Wipe previous data frames for fresh uploads
  };

  // 🧮 LOGIC ENGINE: Dynamic multi-tier sorting model calculation
  // Resilient to page adjustments, tracking spatial coordinates and tie-breaker stamps
  const getSortedDishesWithNumbers = (): (DishItem & { orderNumber: number })[] => {
    return [...dishes]
      .sort((a, b) => {
        // 1️⃣ First Tier: Sort sequentially by Page Index
        if (a.pageIndex !== b.pageIndex) return a.pageIndex - b.pageIndex;
        // 2️⃣ Second Tier: Sort vertically by Y Coordinate Position (Highest first)
        if (a.yPercent !== b.yPercent) return a.yPercent - b.yPercent;
        // 3️⃣ Third Tier: Tie-Breaker sorting by exact creation timestamp
        return a.createdAt - b.createdAt;
      })
      .map((dish, index) => ({
        ...dish,
        orderNumber: index + 1 // 🔢 Output number derived dynamically based on current sorted array index
      }));
  };

  // 🎯 LOGIC: Intercept canvas clicks and auto-focus the new row's name field
  const handleAddNewCoordinatePin = (coords: Omit<DishItem, 'id' | 'pageIndex' | 'name' | 'cost' | 'prepTime' | 'createdAt'>) => {
    const newId = crypto.randomUUID();
    const newDishRecord: DishItem = {
      ...coords,
      id: newId,
      pageIndex: activePageIndex,
      name: '',
      cost: '',
      prepTime: '',
      createdAt: Date.now() // ⏳ Stamp execution timestamp for sorting precision
    };

    setDishes((prev) => [...prev, newDishRecord]);
    
    // ⚡ Feature: Instantly focus the Name input field of the newly created item row
    setActiveEditCell({ id: newId, field: 'name' });
  };

  // 📝 LOGIC: Handle live data edits across inline cells
  const handleUpdateDishDataField = (id: string, field: 'name' | 'cost' | 'prepTime', value: string) => {
    setDishes((prev) => 
      prev.map((dish) => (dish.id === id ? { ...dish, [field]: value } : dish))
    );
  };

  // Run the data array compilation engine
  const computedDishesDataset = getSortedDishesWithNumbers();

  return (
    <div className="w-full h-full flex gap-6 items-stretch overflow-hidden bg-brand-background select-none px-4">
      
      {/* COLUMN 1: LEFT COMPACT OPERATIONS COLUMN (Sits below sidebar action zone footprint) */}
      
      
      <div className="w-18 flex flex-col gap-4 pt-30 shrink-0 h-full items-center">
        {/* Component 0: Add page button */}
        <button
          type="button"
          onClick={() => console.log('Inject code: Shift layout to page 2 view state')}
          className="w-full h-16 bg-white rounded-xl shadow-yummizi border border-brand-navy/5 flex flex-col items-center justify-center p-3 text-center hover:scale-[1.02] cursor-pointer active:scale-[0.98] transition-all group"
          >
          <span className="font-heading font-bold text-[14px] text-brand-primary uppercase tracking-tighter leading-tight">
              Añadir <br /> página
          </span>
        </button>
        
        {/* Component 1: Page Changer */}
        <PageChanger 
          currentPage={uploadedMenuImages.length > 0 ? activePageIndex + 1 : 0}
          totalPages={uploadedMenuImages.length}
          onPageUp={handlePagePrevious}
          onPageDown={handlePageNext}
        />
        {/* Component 2: Group Label Button */}
        <button
            type="button"
            onClick={() => console.log('Inject code: Shift layout to page 2 view state')}
            className="w-full h-16 bg-white rounded-xl shadow-yummizi border border-brand-navy/5 flex flex-col items-center justify-center p-3 text-center hover:scale-[1.02] cursor-pointer active:scale-[0.98] transition-all group"
            >
            <span className="font-heading font-bold text-[14px] text-brand-primary uppercase tracking-tighter leading-tight">
                Grupos de etiquetas
            </span>
        </button>
      </div>

      {/* COLUMN 2: CENTRAL INTERACTIVE VIEWPORT COLUMN */}
      <div className="flex-1 flex flex-col items-center h-screen min-w-[320px]">
        {/* Component 3: View Selector (Touches extreme top bounds) */}
        <div className="h-[10%] shrink-0 flex justify-center">
          <ViewSelector // TODO: Move it to the right of the Menu display and become it vertical
            onToggleView={(mode) => console.log(`Inject code: Switch grid viewport profile to ${mode}`)}
          />
        </div>
        {/* Component 4: Dynamic Interactive Menu Display Context */}
        {/** <div className="h-[90%]">  It worked previously, is it a bad practices? */}
        <div className="flex-1 pb-4 pt-4 min-h-0">
          <MenuDisplay 
            activeImageSrc={uploadedMenuImages.length > 0 ? uploadedMenuImages[activePageIndex] : null}
            currentPageIndex={activePageIndex}
            dishesWithNumbers={computedDishesDataset} // 🔌 Passing live dataset with computed numbers
            onImagesUploaded={handleUploadedFilesPipeline}
            onCoordinateAdded={handleAddNewCoordinatePin}
          />
        </div>
      </div>

      {/* COLUMN 3: RIGHT ANALYTICS & RECTIFICATION DATA COLUMN */}
      <div className="w-112.5 lg:w-130 flex flex-col items-stretch h-screen shrink-0">
        {/* Component 5: Support Frame (Touches extreme top bounds) */}
        <div className="h-16 shrink-0 flex justify-center">
          <SupportFrame 
            onUndo={() => console.log('Inject code: Revert operation history queue')}
            onRedo={() => console.log('Inject code: Re-apply operation history queue')}
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
          />
        </div>
      </div>

    </div>
  );
}