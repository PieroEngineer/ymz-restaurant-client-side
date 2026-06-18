import { PeopleIcon } from "@/features/menu/components/icons/PeopleIcon";
import { EditIcon } from "@/features/menu/components/icons/EditIcon";

interface ViewSelectorProps {
  inEditMode?: boolean;
  onToggleView?: (mode: string) => void;
  comingSoonCover?: boolean;
}

export function ViewSelector({ inEditMode = true, comingSoonCover = false, onToggleView }: ViewSelectorProps) {
  return (
    <div className="relative bg-white rounded-b-2xl shadow-yummizi px-6 py-2 flex items-center gap-4 border-x border-b border-brand-navy/5 h-16 z-10 self-center">
      {/* View Icon Toggle Endpoint A */}
      <button 
        type="button"
        onClick={() => onToggleView?.('grid')}
        className="size-12 rounded-md flex items-center justify-center text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 cursor-pointer"
      >
        <PeopleIcon className='size-12'/>
      </button>

      {/* View Icon Toggle Endpoint B */}
      <button 
        type="button"
        onClick={() => onToggleView?.('list')}
        className="size-12 rounded-md flex items-center justify-center text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 cursor-pointer"
      >
        <EditIcon className='size-12'/>
      </button>

      {/* Display Descriptor String Element */}
      <span className="font-heading font-bold text-brand-primary tracking-wide text-md whitespace-nowrap min-w-25 text-center uppercase">
        {inEditMode ? "Vista editable" : "Vista de usuario"}  {/*TODO: When it's customer view, it show the current snapshot*/}
      </span>

      {comingSoonCover && (
        <div className="absolute inset-0 bg-black/60 rounded-b-2xl backdrop-blur-[1px] flex items-center justify-center cursor-not-allowed select-none">
            <span className="text-white text-sm font-bold tracking-wider uppercase">
                Próximamente
            </span>
        </div>
      )}
    </div>
  );
}