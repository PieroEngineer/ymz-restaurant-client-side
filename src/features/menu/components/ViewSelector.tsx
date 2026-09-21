import { PeopleIcon } from "@/features/menu/components/icons/PeopleIcon";
import { EditIcon } from "@/features/menu/components/icons/EditIcon";

interface ViewSelectorProps {
  inEditMode?: boolean;
  onToggleView?: (mode: string) => void;
  comingSoonCover?: boolean;
}

export function ViewSelector({ inEditMode = true, comingSoonCover = false, onToggleView }: ViewSelectorProps) {
  return (
    <div className="relative bg-white rounded-2xl lg:rounded-b-2xl lg:rounded-t-none shadow-yummizi px-3 sm:px-4 lg:px-6 py-2 flex items-center justify-center gap-2 sm:gap-4 border border-brand-navy/5 lg:border-t-0 min-h-14 lg:h-16 z-10 self-center max-w-full">
      {/* View Icon Toggle Endpoint A */}
      <button 
        type="button"
        onClick={() => onToggleView?.('grid')}
        className="size-10 lg:size-12 rounded-md flex items-center justify-center text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 cursor-pointer shrink-0"
      >
        <PeopleIcon className='size-10 lg:size-12'/>
      </button>

      {/* View Icon Toggle Endpoint B */}
      <button 
        type="button"
        onClick={() => onToggleView?.('list')}
        className="size-10 lg:size-12 rounded-md flex items-center justify-center text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 cursor-pointer shrink-0"
      >
        <EditIcon className='size-10 lg:size-12'/>
      </button>

      {/* Display Descriptor String Element */}
      <span className="font-heading font-bold text-brand-primary tracking-wide text-xs sm:text-sm lg:text-md whitespace-nowrap min-w-0 sm:min-w-25 text-center uppercase">
        {inEditMode ? "Vista editable" : "Vista de usuario"}  {/*TODO: When it's customer view, it show the current snapshot*/}
      </span>

      {comingSoonCover && (
        <div className="absolute inset-0 bg-black/60 rounded-2xl lg:rounded-b-2xl lg:rounded-t-none backdrop-blur-[1px] flex items-center justify-center cursor-not-allowed select-none">
            <span className="text-white text-sm font-bold tracking-wider uppercase">
                Próximamente
            </span>
        </div>
      )}
    </div>
  );
}
