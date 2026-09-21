import { ArrowIcon } from '@/features/menu/components/icons/ArrowIcon';

interface PageChangerProps {
  onPageUp?: () => void;
  onPageDown?: () => void;
  currentPage?: number;
  totalPages: number;
}

export function PageChanger({ onPageUp, onPageDown, currentPage, totalPages}: PageChangerProps) {
  // Logic: Determine if navigation limits have been met
  const isAtFirstPage = currentPage === 1;
  const isAtLastPage = currentPage === totalPages || totalPages === 0;
  
  return (
    <div className="w-full bg-white rounded-xl shadow-yummizi flex flex-row lg:flex-col items-center justify-center px-2 py-2 gap-2 lg:gap-4 border border-brand-navy/5">
      {/* Upper Navigation Arrow Trigger Placeholder */}
      <button 
        type="button" 
        onClick={onPageUp}
        disabled={isAtFirstPage}
        className={`size-10 rounded-lg flex items-center justify-center bg-slate-50 text-brand-navy transition-all duration-200 ${
          isAtFirstPage ? 'opacity-20 cursor-not-allowed' : 'hover:bg-brand-primary/10 cursor-pointer'
        }`}
      >
        <ArrowIcon className='size-7 lg:size-8 -rotate-90 lg:rotate-180'/>
      </button>
      
      {/* Live Page Count Tracker Layout Slot */}
      <span className="font-heading font-bold text-xs text-brand-navy/40 select-none min-w-9 text-center">
        {totalPages > 0 ? `${currentPage}/${totalPages}` : '0/0'}
      </span>

      {/* Lower Navigation Arrow Trigger Placeholder */}
      <button 
        type="button" 
        onClick={onPageDown}
        disabled={isAtLastPage}
        className={`size-10 rounded-lg flex items-center justify-center bg-slate-50 text-brand-navy transition-all duration-200 ${
          isAtLastPage ? 'opacity-20 cursor-not-allowed' : 'hover:bg-brand-primary/10 cursor-pointer'
        }`}
      >
        <ArrowIcon className='size-7 lg:size-8 rotate-90 lg:rotate-0'/>
      </button>
    </div>
  );
}
