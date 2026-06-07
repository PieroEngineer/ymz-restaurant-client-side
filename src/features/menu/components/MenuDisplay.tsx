import React, { useRef, useState, useEffect } from 'react';
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
  createdAt: number; // TODO: Remove this attribute becase it was made to handle marks in the same position but that should not happen
}

interface MenuDisplayProps {
  activeImageSrc: string | null;
  currentPageIndex: number;
  // 🔢 Array of dishes already injected with their dynamically calculated N° values
  dishesWithNumbers: (DishItem & { orderNumber: number })[];
  onImagesUploaded: (fileUrls: string[]) => void;
  onCoordinateAdded: (coord: Omit<DishItem, 'id' | 'pageIndex' | 'name' | 'cost' | 'prepTime' | 'createdAt'>) => void;
  // 🚀 New FDD Operations Data Pipes
  onCoordinateUpdated: (id: string, xPercent: number, yPercent: number) => void;
  onCoordinateDragStarted: (id: string) => void;
  onCoordinateDragCommitted: () => void;
  onCoordinateDeleted: (id: string) => void;
    // 🔌 Action callback to target a table row directly from a marker pin
  onTargetRowFocusRequested: (id: string) => void;
}

export function MenuDisplay({ 
  activeImageSrc, 
  currentPageIndex, 
  dishesWithNumbers, 
  onImagesUploaded, 
  onCoordinateAdded,
  onCoordinateUpdated,
  onCoordinateDragStarted,
  onCoordinateDragCommitted,
  onCoordinateDeleted,
  onTargetRowFocusRequested

}: MenuDisplayProps) {

  // Reference triggers for native file upload explorer and image elements
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // 🧠 State Tracking Matrices for Hover Frames & Drag Gestures
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [draggingPinId, setDraggingPinId] = useState<string | null>(null);

  // 🧹 Keyboard Listener: Collapse expanded action frames instantly when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setHoveredPinId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 🎯 Core Canvas Interaction: Adds a pin if we aren't dragging or interacting with an action frame
  const handleImageCanvasClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (draggingPinId || hoveredPinId) return;
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    onCoordinateAdded({ xPercent, yPercent });
  };

  // 🪵 Gesture Dragging Engine: Updates coordinates in real-time as mouse moves across container canvas bounds
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggingPinId || !imageRef.current) return;

    // Get exact runtime rendering spatial width/height/offsets of the image element
    const rect = imageRef.current.getBoundingClientRect();
    
    // 📏 Boundary Protection Rule: Force calculations to lock between 0% and 100% boundary limits
    const boundedX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const boundedY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    onCoordinateUpdated(draggingPinId, boundedX, boundedY);
  };


  // 🛑 Gesture Drop Event Engine: Fires formal completion hook when user releases mouse hold click
  const handleCanvasMouseUp = () => {
    if (!draggingPinId) return;

    onCoordinateDragCommitted();
    setDraggingPinId(null);
  };

  // Filter out pin markers belonging strictly to the menu page being viewed right now
  const activePagePins = dishesWithNumbers.filter(dish => dish.pageIndex === currentPageIndex);

  return (
    <div 
      className="w-auto h-full bg-white border-2 border-brand-navy rounded-3xl flex flex-col justify-center items-center relative overflow-hidden" /// |-> X group transition-all
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp} // Auto-drop if mouse slips entirely out of the display box
    >

      {/* 📥 Hidden System Input Element managed by pointer anchors */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onImagesUploaded(Array.from(e.target.files).map(file => URL.createObjectURL(file)));
          }
        }} 
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
              className="w-auto h-full object-contain pointer-events-auto rounded-lg" 
            />

            {activePagePins.map((pin) => {
              const isHovered = hoveredPinId === pin.id;
              const isRightSide = pin.xPercent < 50;

              return (
                <div
                  key={pin.id}
                  /* 🔌 Mouse Event hooks injected to track shared bounding space */
                  onMouseEnter={() => setHoveredPinId(pin.id)}
                  onMouseLeave={() => setHoveredPinId(null)}
                  onMouseDown={(e) => {
                    e.stopPropagation(); // Stop click from creating a second pin on top of this one
                    onCoordinateDragStarted(pin.id);
                    setDraggingPinId(pin.id);
                    //XsetHoveredPinId(null); // 🧹 Rule: Collapse expanded frame immediately when dragging starts
                  }}
                  /* 🔥 Crucial Fix: Changed pointer-events-none to auto, added grip styling changes */
                  className={`absolute size-6 -ml-3 -mt-3 bg-brand-primary border-2 border-white rounded-full flex items-center justify-center shadow-md animate-scale-in text-[10px] text-white font-bold select-none pointer-events-auto transition-transform ${
                    draggingPinId === pin.id ? 'cursor-grabbing scale-125 z-40' : 'cursor-grab hover:scale-110 z-30'
                  }`}
                  style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                >
                  {/* Custom Graphic Marker Asset */}
                  <img
                    src={SelectionIcon}
                    alt="Description of icon"
                    loading="lazy" // Optimizes loading if it is below the fold
                    className='pointer-events-none'
                  />

                  {/* Dynamic Floating Index Badge Group */}
                  <div className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center size-8 bg-brand-secondary/30 rounded-full text-white text-xs font-sans ${isRightSide ? "left-full ml-1" : "right-full mr-1"}`}>
                    {pin.orderNumber}
                  </div>

                  {/* 🧡 THE EXPANDING ACTION OBROUND FRAME */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 h-10 bg-brand-primary rounded-full flex items-center justify-center px-3 gap-3 transition-all duration-200 ease-out z-50 pointer-events-auto cursor-default ${
                      isHovered 
                        ? 'opacity-100 scale-100 visible' 
                        : 'opacity-0 scale-75 invisible pointer-events-none'
                    } ${
                      isRightSide 
                        ? 'left-[calc(100%+40px)] origin-left before:absolute before:right-full before:w-12 before:h-full before:content-[""]' 
                        : 'right-[calc(100%+40px)] origin-right before:absolute before:left-full before:w-12 before:h-full before:content-[""]'
                    } ${
                      /* 👻 Feature: Multi-layered Echo Ghost Shadow configuration trail */
                      'shadow-[4px_4px_0_rgba(255,117,31,0.3),8px_8px_0_rgba(255,117,31,0.15)]'
                    }`}
                  >
                    {/* 🗑️ Left Action Button: Wipe coordinate record out of state arrays */}
                    <button
                      type="button"
                      onClick={(e) => {
                        console.log("Trying to delete: ", pin.id)
                        e.stopPropagation(); // Avoid event triggering canvas adjustments
                        onCoordinateDeleted(pin.id);
                        setHoveredPinId(null);
                      }}
                      className="text-white text-xs font-bold hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      title="Delete Marker"
                    >
                      🗑️
                    </button>

                    {/* ▫️ Vertical partition separation wireframe rule line */}
                    <div className="w-px h-4 bg-white/40 shrink-0" />

                    {/* Right Action Button: Stub placeholder reserved for future extensions */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTargetRowFocusRequested(pin.id);
                        setHoveredPinId(null); // Collapse frame after jumping
                      }}
                      className="text-white opacity-60 text-xs font-bold hover:scale-120 active:scale-90 transition-transform cursor-pointer"
                    >
                      ⚙️
                    </button>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      ) : (
        /* 🫙 EMPTY STATE INTERFACE PLATFORM */
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-full flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-slate-50 transition-colors"
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
