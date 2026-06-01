interface ViewSelectorProps {
  currentViewMode?: string;
  onToggleView?: (mode: string) => void;
}

export function ViewSelector({ currentViewMode = 'Standard View', onToggleView }: ViewSelectorProps) {
  return (
    <div className="bg-white rounded-b-2xl shadow-yummizi px-6 flex items-center gap-4 border-x border-b border-brand-navy/5 h-16 z-10 self-center">
      {/* View Icon Toggle Endpoint A */}
      <button 
        type="button"
        onClick={() => onToggleView?.('grid')}
        className="w-8 h-8 rounded-md flex items-center justify-center text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 cursor-pointer"
      >
        ⚃
      </button>

      {/* Display Descriptor String Element */}
      <span className="font-heading font-bold text-brand-primary tracking-wide text-sm whitespace-nowrap min-w-25 text-center uppercase">
        {currentViewMode}
      </span>

      {/* View Icon Toggle Endpoint B */}
      <button 
        type="button"
        onClick={() => onToggleView?.('list')}
        className="w-8 h-8 rounded-md flex items-center justify-center text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 cursor-pointer"
      >
        ☰
      </button>
    </div>
  );
}