interface HubButtonProps {
  label: string;
  imageSrc: string;
  comingSoonCover?: boolean;
  altText?: string;
  contentPadding?: string; // e.g., "p-4", "p-8", "p-12" to control interior spacing
  onClick?: () => void;
}

// 1. UPDATE DEFAULT PROP VALUE
export function HubButton({ 
  label, 
  imageSrc, 
  comingSoonCover = false, 
  altText, 
  contentPadding = 'p-4 sm:p-6 md:p-8', // Responsive default padding
  onClick 
}: HubButtonProps) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`relative w-full h-full min-h-30 md:min-h-0 flex flex-col items-center justify-center gap-3 sm:gap-6 bg-brand-primary rounded-2xl shadow-yummizi hover:shadow-yummizi-hover hover:scale-[1.01] transition-all duration-200 cursor-pointer ${contentPadding}`}
    >
      {/* 3. UPDATE ICON IMAGE SIZE */}
      <img 
        src={imageSrc} 
        alt={altText || label} 
        className="size-12 sm:size-16 md:size-20 lg:size-24 object-contain select-none transition-transform group-hover:scale-105"
      />
      
      {/* 4. UPDATE LABEL TEXT SIZE */}
      <span className="font-heading font-bold text-white tracking-wide text-center text-base sm:text-xl lg:text-2xl leading-tight max-w-[90%]">
        {label}
      </span>

      {comingSoonCover && (
        <div className="absolute inset-0 bg-black/60 rounded-xl backdrop-blur-[1px] flex items-center justify-center cursor-not-allowed select-none">
          <span className="text-white text-xs sm:text-sm font-bold tracking-wider uppercase">
            Próximamente
          </span>
        </div>
      )}
    </button>
  );
}