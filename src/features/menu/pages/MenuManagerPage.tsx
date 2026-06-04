import { useState } from 'react';

import { PageChanger } from '@/features/menu/components/PageChanger';
import { ViewSelector } from '@/features/menu/components/ViewSelector';
import { MenuDisplay, type MenuCoordinate } from '@/features/menu/components/MenuDisplay';
import { SupportFrame } from '@/features/menu/components/SupportFrame';
import { DishChart } from '@/features/menu/components/DishChart';


export function MenuManagerPage() {
  // FDD State Layer Matrix Storage Units
  const [uploadedMenuImages, setUploadedMenuImages] = useState<string[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [masterCoordinates, setMasterCoordinates] = useState<MenuCoordinate[]>([]);

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

  // Logic: Intercept percentage vector captures and append them to data context schemas
  const handleAddNewCoordinatePin = (newPin: Omit<MenuCoordinate, 'id' | 'pageIndex'>) => {
    const freshCoordinateRecord: MenuCoordinate = {
      ...newPin,
      id: crypto.randomUUID(), // Generate a safe localized runtime id token anchor
      pageIndex: activePageIndex, // Save the index number of the image being pinned
    };

    setMasterCoordinates((prev) => [...prev, freshCoordinateRecord]);
    
    // 💡 Prepared debug point layout terminal indicator for later backend wiring connections
    console.log('📌 Saved Image-Relative Coordinate Payload:', freshCoordinateRecord);
  };

  // 📥 Logic: Receive fresh bulk data collections from local input uploads
  const handleUploadedFilesPipeline = (urls: string[]) => {
    setUploadedMenuImages(urls);
    setActivePageIndex(0); // Auto-focus back onto the initial index sheet
  };

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
        <div className="h-[90%]"> {/** Is it a bad practices? */}
          <MenuDisplay 
            activeImageSrc={uploadedMenuImages.length > 0 ? uploadedMenuImages[activePageIndex] : null}
            currentPageIndex={activePageIndex}
            coordinates={masterCoordinates}
            onImagesUploaded={handleUploadedFilesPipeline}
            onCoordinateAdded={handleAddNewCoordinatePin}
          />
        </div>
      </div>

      {/* COLUMN 3: RIGHT ANALYTICS & RECTIFICATION DATA COLUMN */}
      <div className="w-112.5 lg:w-130 flex flex-col items-stretch h-full shrink-0">
        {/* Component 5: Support Frame (Touches extreme top bounds) */}
        <div className="h-16 shrink-0 flex justify-center">
          <SupportFrame 
            onUndo={() => console.log('Inject code: Revert operation history queue')}
            onRedo={() => console.log('Inject code: Re-apply operation history queue')}
          />
        </div>
        {/* Component 6: Dish Chart Data Table Matrix Grid Wrapper */}
        <div className="flex-1 pb-4 pt-4">
          <DishChart 
            onEditItem={(id) => console.log(`Inject code: Open cell-editor inline context overlay for element id ${id}`)}
          />
        </div>
      </div>

    </div>
  );
}