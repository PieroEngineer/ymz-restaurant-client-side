import React, { useRef } from 'react';
import { PlusIcon } from "@/features/menu/components/icons/PlusIcon";
import SelectionIcon from "@/features/menu/assets/SelectionIcon.webp"

// 📝 Unified FDD state contract mapping coordinates to table items
export interface DishItem {
  id: string;
  pageIndex: number;
  xPercent: number;
  yPercent: number;
  name: string;
  cost: string;
  prepTime: string;
  createdAt: number; // ⏳ Tie-breaker timestamp for identical positions
}

// Structure contract for pinning coordinates to specific uploaded sheets
export interface MenuCoordinate {
  id: string;
  pageIndex: number;
  xPercent: number; // Stored as normalized layout percentage 0-100
  yPercent: number; // Stored as normalized layout percentage 0-100
}

interface MenuDisplayProps {
  activeImageSrc: string | null;
  currentPageIndex: number;
  // 🔢 Array of dishes already injected with their dynamically calculated N° values
  dishesWithNumbers: (DishItem & { orderNumber: number })[];
  onImagesUploaded: (fileUrls: string[]) => void;
  onCoordinateAdded: (coord: Omit<DishItem, 'id' | 'pageIndex' | 'name' | 'cost' | 'prepTime' | 'createdAt'>) => void;
}

export function MenuDisplay({ 
  activeImageSrc, 
  currentPageIndex, 
  dishesWithNumbers, 
  onImagesUploaded, 
  onCoordinateAdded 
}: MenuDisplayProps) {

  // Reference triggers for native file upload explorer and image elements
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Logic: Handle local system file upload selection array
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      // Generate temporary runtime local preview URLs
      const objectUrls = filesArray.map(file => URL.createObjectURL(file));
      onImagesUploaded(objectUrls);
    }
  };

  // Logic: Mathematical extraction of image-relative percentage mapping coordinates
  const handleImageCanvasClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;

    // Get exact runtime rendering spatial width/height/offsets of the image element
    const rect = imageRef.current.getBoundingClientRect();
    
    // Calculate precise local pixels within the boundary bounds of the image sheet itself
    const clickXWithinImage = e.clientX - rect.left;
    const clickYWithinImage = e.clientY - rect.top;

    // Convert pixel coordinate targets to structural layout scale safe percentages
    const xPercent = (clickXWithinImage / rect.width) * 100;
    const yPercent = (clickYWithinImage / rect.height) * 100;

    // Forward the relative data coordinates straight up to our FDD state context engine
    onCoordinateAdded({ xPercent, yPercent: yPercent });
  };

  // Filter out pin markers belonging strictly to the menu page being viewed right now
  const activePagePins = dishesWithNumbers.filter(dish => dish.pageIndex === currentPageIndex);

  return (
    <div 
      className="w-auto h-full bg-white border-2 border-brand-navy rounded-3xl flex flex-col justify-center items-center relative overflow-hidden group transition-all"
    >

      {/* 📥 Hidden System Input Element managed by pointer anchors */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        multiple // Feature: Allows selection of multiple files simultaneously
        accept="image/*" 
        className="hidden" 
      />

      {activeImageSrc ? (
        /* 🗺️ ACTIVE COMPONENT VIEW CANVAS PATH */
        <div className="relative w-full h-full flex flex-col items-center p-2 overflow-auto">
          <span className="text-md block text-brand-primary italic flex-none">Clickea sobre el menu para añadir una referencia 👇🏻</span>
          <div className="relative min-h-0 inline-block h-full select-none items-center cursor-crosshair">
            <img 
              ref={imageRef}
              src={activeImageSrc} 
              onClick={handleImageCanvasClick}
              alt="Active Restaurant Menu Page Layout" 
              className="w-auto h-full object-contain pointer-events-auto rounded-lg border" 
            />

            {/* 📍 Feature: Dynamically render target icon tags over exact layout points */}
            {activePagePins.map((pin) => (
              <div
                key={pin.id}
                className="absolute size-6 -ml-3 -mt-3 bg-brand-primary border-2 border-white rounded-full flex items-center justify-center shadow-md animate-scale-in text-[10px] text-white font-bold select-none pointer-events-none"
                style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
              >
                <img 
                  src={SelectionIcon} 
                  alt="Description of icon"
                  loading="lazy" // Optimizes loading if it is below the fold
                />

                {/* <div className={`absolute flex items-center justify-center w-8 h-8 bg-brand-secondary/30 rounded-full text-white text-xs font-sans p-1${ */}
                <div className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center size-8 bg-brand-secondary/30 rounded-full text-white text-xs font-sans ${pin.xPercent<50 ? "left-full ml-1" : "right-full mr-1"}`}>
                  {pin.orderNumber}
                </div>
                

              </div>
            ))}

          </div>
        </div>
      ) : (
        /* 🫙 EMPTY STATE INTERFACE PLATFORM */
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-slate-50 transition-colors group"
        >
          <p className="text-brand-navy font-accents text-2xl leading-relaxed">
            Presiona aquí para agregar <br />páginas de menú
          </p>
          <PlusIcon className='size-12'/>
        </button>
      )}
    </div>
  );
}