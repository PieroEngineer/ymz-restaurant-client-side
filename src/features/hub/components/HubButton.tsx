//Ximport React from 'react';

interface HubButtonProps {
  label: string;
  imageSrc: string;
  altText?: string;
}

export function HubButton({ label, imageSrc, altText }: HubButtonProps) {
  return (
    <button 
      type="button"
      className="w-full h-full flex flex-col items-center justify-center gap-4 bg-brand-primary rounded-2xl shadow-yummizi hover:shadow-yummizi-hover transition-all duration-200 p-6"
    >
      {/* Centered Image Slot */}
      <img 
        src={imageSrc} 
        alt={altText || label} 
        className="w-14 h-14 object-contain select-none"
      />
      
      {/* Aligned Typography */}
      <span className="font-heading font-bold text-white tracking-wide text-center leading-tight max-w-[160px]">
        {label}
      </span>
    </button>
  );
}