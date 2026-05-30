interface HubButtonProps {
  label: string;
  imageSrc: string;
  altText?: string;
  contentPadding?: string; // e.g., "p-4", "p-8", "p-12" to control interior spacing
}

export function HubButton({ label, imageSrc, altText, contentPadding = 'p-8' }: HubButtonProps) {
  return (
    <button 
      type="button"
      className={`w-full h-full flex flex-col items-center justify-center gap-6 bg-brand-primary rounded-2xl shadow-yummizi hover:shadow-yummizi-hover hover:scale-[1.01] transition-all duration-200 cursor-pointer ${contentPadding}`}
    >
      {/* Scaled-up asset wrapper to match larger button targets */}
      <img 
        src={imageSrc} 
        alt={altText || label} 
        className="size-24 object-contain select-none transition-transform group-hover:scale-105"
      />
      
      {/* Amplified text sizes */}
      <span className="font-heading font-bold text-white tracking-wide text-center text-xl md:text-2xl lg:text-3xl leading-tight max-w-[85%]">
        {label}
      </span>
    </button>
  );
}