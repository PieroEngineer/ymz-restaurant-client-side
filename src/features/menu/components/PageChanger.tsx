import { ArrowIcon } from '@/features/menu/components/icons/ArrowIcon';

interface PageChangerProps {
  onPageUp?: () => void;
  onPageDown?: () => void;
  currentPage?: number;
}

export function PageChanger({ onPageUp, onPageDown, currentPage = 1 }: PageChangerProps) {
  return (
    <div className="w-full bg-white rounded-xl shadow-yummizi flex flex-col items-center justify-center py-4 gap-4 border border-brand-navy/5">
      {/* Upper Navigation Arrow Trigger Placeholder */}
      <button 
        type="button" 
        onClick={onPageUp}
        className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-50 text-brand-navy hover:bg-brand-primary/10 cursor-pointer transition-colors"
      >
        <ArrowIcon className='size-8 rotate-180'/>
      </button>
      
      {/* Live Page Count Tracker Layout Slot */}
      <span className="font-heading font-bold text-xs text-brand-navy/40 select-none">
        P. {currentPage}
      </span>

      {/* Lower Navigation Arrow Trigger Placeholder */}
      <button 
        type="button" 
        onClick={onPageDown}
        className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-50 text-brand-navy hover:bg-brand-primary/10 cursor-pointer transition-colors"
      >
        <ArrowIcon className='size-8'/>
      </button>
    </div>
  );
}