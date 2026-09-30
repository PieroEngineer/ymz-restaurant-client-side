import React, { type ChangeEvent, useRef, useState, useEffect } from 'react';
import { type DishItem } from '@/features/menu/types/domain.types';
import { TrashIcon } from "@/features/menu/components/icons/TrashIcon";
import { PencilIcon } from "@/features/menu/components/icons/PencilIcon";
import { PlusIcon } from "@/features/menu/components/icons/PlusIcon";
import SelectionIcon from "@/features/menu/assets/SelectionIcon.webp"

interface MenuDisplayProps {
  activeImageSrc: string | null;
  currentPageId: string | null;

  // 🔢 Array of dishes already injected with their dynamically calculated N° values
  dishesWithNumbers: (DishItem & { orderNumber: number })[];

  onImagesUploaded: (localFileEvent: ChangeEvent<HTMLInputElement>) => void;

  onCoordinateAdded: (coord: {coordinateXInMenu: number, coordinateYInMenu: number}) => void;
  // 🚀 New FDD Operations Data Pipes
  onCoordinateUpdated: (id: string, xPercent: number, yPercent: number) => void;
  // onCoordinateDragStarted: (id: string) => void;
  // onCoordinateDragCommitted: () => void;
  onCoordinateDeleted: (id: string) => void;
  
    // 🔌 Action callback to target a table row directly from a marker pin
  onTargetRowFocusRequested: (id: string) => void;
}

export function MenuDisplay({   // TODO: This sub comonent needs an urgent hook-based refactoring
  activeImageSrc, 
  currentPageId, 

  dishesWithNumbers, 

  onImagesUploaded, 

  onCoordinateAdded,
  onCoordinateUpdated,
  // onCoordinateDragStarted,   /// Retake it when undo & redo come back
  // onCoordinateDragCommitted,
  onCoordinateDeleted,

  onTargetRowFocusRequested

}: MenuDisplayProps) {

  // Reference triggers for native file upload explorer and image elements
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // 🧠 State Tracking Matrices for Hover Frames & Drag Gestures
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);
  const [draggingPinId, setDraggingPinId] = useState<string | null>(null);

  const draggingPinIdRef = useRef<string | null>(null);
  const dragPositionRef = useRef<{ xPercent: number; yPercent: number } | null>(null);
  const pinElementRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const animationFrameRef = useRef<number | null>(null);

  const setPinElementRef = (id: string) => (node: HTMLDivElement | null) => {
    pinElementRefs.current[id] = node;
  };

  const updateDraggedPinStyle = () => {
    animationFrameRef.current = null;

    const activeDragId = draggingPinIdRef.current;
    const currentPos = dragPositionRef.current;
    if (!activeDragId || !currentPos) return;

    const pinElement = pinElementRefs.current[activeDragId];
    if (!pinElement) return;

    pinElement.style.left = `${currentPos.xPercent * 100}%`;
    pinElement.style.top = `${currentPos.yPercent * 100}%`;
  };

  const scheduleDraggedPinStyleUpdate = (xPercent: number, yPercent: number) => {
    dragPositionRef.current = { xPercent, yPercent };
    if (animationFrameRef.current != null) return;
    animationFrameRef.current = requestAnimationFrame(updateDraggedPinStyle);
  };

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
    const xPercent = ((e.clientX - rect.left) / rect.width);
    const yPercent = ((e.clientY - rect.top) / rect.height);

    onCoordinateAdded({ coordinateXInMenu: xPercent, coordinateYInMenu: yPercent });  /// Possible optimization (#3252)
  };

  // 🪵 Gesture Dragging Engine: Updates coordinates as the active pointer moves across the canvas
  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!draggingPinIdRef.current || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const boundedX = Math.max(0, Math.min(1, ((e.clientX - rect.left) / rect.width)));
    const boundedY = Math.max(0, Math.min(1, ((e.clientY - rect.top) / rect.height)));

    scheduleDraggedPinStyleUpdate(boundedX, boundedY);  /// Possible optimization (#3252): we could round decimals, many of them are not necessary
  };


  // 🛑 Gesture Drop Event Engine: Fires formal completion hook when the active pointer is released
  const handleCanvasPointerUp = () => {
    if (!draggingPinIdRef.current) return;

    const activeDragId = draggingPinIdRef.current;
    const dragPosition = dragPositionRef.current;

    if (dragPosition) {
      onCoordinateUpdated(activeDragId, dragPosition.xPercent, dragPosition.yPercent);
    }

    // onCoordinateDragCommitted();
    setDraggingPinId(null);
    draggingPinIdRef.current = null;
    dragPositionRef.current = null;

    if (animationFrameRef.current != null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Complementary dishes shouldn't appear in the menu
  const mainDishesWithNumbers = dishesWithNumbers.filter( dish => dish.type !== "COMPLEMENTARY" );
  
  // Filter out pin markers belonging strictly to the menu page being viewed right now
  const activePagePins = mainDishesWithNumbers.filter(dish => dish.parentPageId === currentPageId);

  //TODO: Verify if it's ok that the menu recompose everytime some letter is written in the dish chart. I found it by placing a log in the possition of this comment

  return (
    <div 
      className="w-full lg:w-auto h-full min-h-96 lg:min-h-0 bg-white border-2 lg:border-3 shadow-yummizi border-brand-navy rounded-2xl lg:rounded-3xl flex flex-col justify-center items-center relative overflow-hidden"
      onPointerMove={handleCanvasPointerMove}
      onPointerUp={handleCanvasPointerUp}
      onPointerCancel={handleCanvasPointerUp}
    >

      {/* 📥 Hidden System Input Element managed by pointer anchors */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onImagesUploaded} 
        multiple // Feature: Allows selection of multiple files simultaneously
        accept="image/*" 
        className="hidden" 
      />

      {activeImageSrc ? (
        /* 🗺️ ACTIVE COMPONENT VIEW CANVAS PATH */
        <div className="relative w-full h-full flex flex-col items-center gap-2 lg:gap-0 p-2 overflow-auto">
          <span className="text-xs sm:text-sm lg:text-md block text-brand-primary italic flex-none text-center lg:text-left leading-tight lg:leading-normal px-2 lg:px-0">Clickea sobre el menu para añadir una referencia 👇🏻</span>
          <div className="relative min-h-0 inline-block flex-1 lg:flex-none lg:h-full max-w-full lg:max-w-none select-none items-center cursor-crosshair">
            <img 
              ref={imageRef}
              src={activeImageSrc} 
              onClick={handleImageCanvasClick}
              alt="Active Restaurant Menu Page Layout" 
              className="w-auto h-full max-w-full lg:max-w-none object-contain pointer-events-auto rounded-lg" 
            />

            {activePagePins.map((pin) => {
              const isHovered = hoveredPinId === pin.id;
              const isRightSide = pin.coordinateXInMenu < .5;

              return (
                <div
                  key={pin.id}
                  ref={setPinElementRef(pin.id)}
                  /* 🔌 Pointer hooks support both mouse and touch gestures */
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') setHoveredPinId(pin.id);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === 'mouse') setHoveredPinId(null);
                  }}
                  onPointerDown={(e) => {
                    if (e.target instanceof Element && e.target.closest('button')) return;
                    e.stopPropagation(); // Stop click from creating a second pin on top of this one
                    // onCoordinateDragStarted(pin.id);
                    setDraggingPinId(pin.id);
                    draggingPinIdRef.current = pin.id;
                    if (e.pointerType === 'touch') setHoveredPinId(pin.id);
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  /* 🔥 Crucial Fix: Changed pointer-events-none to auto, added grip styling changes */
                  className={`absolute size-6 -ml-3 -mt-3 bg-brand-primary border-2 border-white rounded-full flex items-center justify-center shadow-md animate-scale-in text-[10px] text-white font-bold select-none pointer-events-auto transition-transform touch-none ${
                    draggingPinId === pin.id ? 'cursor-grabbing scale-125 z-40' : 'cursor-grab hover:scale-110 z-30'
                  }`}
                  style={{ left: `${pin.coordinateXInMenu*100}%`, top: `${pin.coordinateYInMenu*100}%` }}
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
                    className={`absolute top-1/2 -translate-y-1/2 h-10 bg-brand-primary rounded-full flex items-center justify-center px-4 lg:px-3 gap-3 transition-all duration-200 ease-out z-50 pointer-events-auto cursor-default ${
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
                        e.stopPropagation(); // Avoid event triggering canvas adjustments
                        onCoordinateDeleted(pin.id);
                        setHoveredPinId(null);
                      }}
                      className="size-10 flex items-center justify-center rounded-full hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      title="Borrar pin"
                    >
                      <TrashIcon className='size-5'/>
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
                      className="size-10 flex items-center justify-center rounded-full hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                      title="Editar pin"
                    >
                      <PencilIcon className='size-5'/>
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
          className="w-full h-full min-h-96 lg:min-h-0 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-slate-50 transition-colors text-center"
        >
          <p className="text-brand-navy font-accents text-xl sm:text-2xl leading-relaxed">
            Presiona aquí para agregar <br />páginas de menú
          </p>
          <PlusIcon className='size-12'/>
        </button>
      )}
    </div>
  );
}
