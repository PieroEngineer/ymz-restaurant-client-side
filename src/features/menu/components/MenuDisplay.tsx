import React from 'react';
import { PlusIcon } from "@/features/menu/components/icons/PlusIcon";

interface MenuDisplayProps {
  imageSrc?: string;
  onImageClick?: (coordinates: { x: number; y: number }) => void;
}

export function MenuDisplay({ imageSrc, onImageClick }: MenuDisplayProps) {
  // Stub function layer to capture click coordinates over menu blueprints later
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (onImageClick) onImageClick({ x, y });
  };

  return (
    <div 
      onClick={handleCanvasInteraction}
      className="w-max h-full p-2 bg-white border-2 border-brand-navy rounded-3xl flex flex-col justify-center items-center relative overflow-hidden group transition-all"
    >
      
      {imageSrc ? (
        <div className="text-center flex flex-col justify-center items-center select-none">
          <span className="text-md block text-brand-primary italic">Clickea el menu para añadir una referencia 👇🏻</span>
          <img 
            src={imageSrc} 
            alt="Active Restaurant Blueprint" 
            className="w-full h-full object-contain select-none" 
          />
        </div>
      ) : (
        <div className="text-center flex flex-col justify-center items-center select-none gap-15">
            <p className="text-brand-navy font-accents text-2xl leading-relaxed">
              Presiona aquí para agregar <br />páginas de menú
            </p>
          <PlusIcon className='size-12'/>
        </div>
      )}
    </div>
  );
}