import React from 'react';

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
      className="w-full h-full bg-white border-2 border-brand-navy rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group transition-all"
    >
      {imageSrc ? (
        <img 
          src={imageSrc} 
          alt="Active Restaurant Blueprint" 
          className="w-full h-full object-contain pointer-events-none select-none" 
        />
      ) : (
        <div className="text-center p-6 pointer-events-none select-none">
          <span className="text-6xl mb-3 block opacity-30">📋</span>
          <p className="font-heading font-bold text-brand-navy/30 text-sm tracking-wide uppercase">
            [ Interactive Menu Display Asset Space ]
          </p>
        </div>
      )}
    </div>
  );
}