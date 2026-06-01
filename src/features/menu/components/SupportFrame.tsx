interface SupportFrameProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onHelp?: () => void;
}

export function SupportFrame({ onUndo, onRedo, onHelp }: SupportFrameProps) {
  return (
    <div className="bg-brand-navy rounded-b-2xl shadow-[0_8px_16px_rgba(0,21,96,0.2)] px-6 flex items-center gap-4 h-16 z-10 self-center">
      {/* Active Action Node */}
      <button 
        type="button" 
        onClick={onUndo}
        className="w-8 h-8 rounded-md flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
        title="Undo action"
      >
        ↶
      </button>
      
      {/* Thin separation anchor line segment right next to first icon */}
      <div className="h-6 w-px bg-white/20 shrink-0" />

      {/* Secondary Action Node */}
      <button 
        type="button" 
        onClick={onRedo}
        className="w-8 h-8 rounded-md flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
        title="Redo action"
      >
        ↷
      </button>

      {/* Tertiary Action Node */}
      <button 
        type="button" 
        onClick={onHelp}
        className="w-8 h-8 rounded-md flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
        title="Documentation help"
      >
        ?
      </button>
    </div>
  );
}