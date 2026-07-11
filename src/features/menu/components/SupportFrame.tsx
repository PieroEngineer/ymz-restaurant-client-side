import { InfoIcon } from "@/features/menu/components/icons/InfoIcon";
import { CurvedArrowIcon } from "@/features/menu/components/icons/CurvedArrowIcon";

interface SupportFrameProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onHelp?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function SupportFrame({ onUndo, onRedo, onHelp, canUndo = false, canRedo = false }: SupportFrameProps) {
  return (
    <div className="bg-brand-navy rounded-b-2xl shadow-[0_8px_16px_rgba(0,21,96,0.2)] px-6 flex items-center gap-4 h-16 z-10 self-center">
      
      {/* Tertiary Action Node */}
      <button 
        type="button" 
        onClick={onHelp}
        className="w-8 h-8 rounded-md flex items-center justify-center hover:scale-[1.1] cursor-pointer transition-colors"
        title="Documentation help"
      >
        <InfoIcon className='size-8'/>
      </button>
            
      {/* Thin separation anchor line segment right next to first icon */}
      <div className="h-6 w-px bg-white shrink-0" />

      <div className="relative flex gap-4 py-3 px-8">  
        {/* Active Action Node */}
        <button 
          type="button" 
          onClick={onUndo}
          disabled={!canUndo}
          className="w-8 h-8 rounded-md flex items-center justify-center hover:scale-[1.1] cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100"
          title="Undo action"
        >
          <CurvedArrowIcon className='size-8'/>
        </button>

        {/* Secondary Action Node */}
        <button 
          type="button" 
          onClick={onRedo}
          disabled={!canRedo}
          className="w-8 h-8 rounded-md flex items-center justify-center hover:scale-[1.1] cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100"
          title="Redo action"
        >
          <CurvedArrowIcon className='size-8 rotate-180'/>
        </button>

        <div className="absolute inset-0 bg-black/60 rounded-b-2xl backdrop-blur-[1px] flex items-center justify-center cursor-not-allowed select-none">
            <span className="text-white text-sm font-bold tracking-wider uppercase">
                Próximamente
            </span>
        </div>
      </div>
    </div>
  );
}
