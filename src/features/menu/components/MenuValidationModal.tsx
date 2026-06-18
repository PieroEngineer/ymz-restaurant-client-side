import React from 'react';
import { type InvalidDishDetail, formatPageNumbersList } from '@/features/menu/utils/menuValidators';

interface MenuValidationModalProps {
  isOpen: boolean;
  mode: 'EMPTY_PAGES' | 'INVALID_DISHES' | null;
  emptyPageNumbers: number[];
  invalidDishes: InvalidDishDetail[];
  onClose: () => void;
  onProceedAnyway: () => void;
}

export const MenuValidationModal: React.FC<MenuValidationModalProps> = ({
  isOpen,
  mode,
  emptyPageNumbers,
  invalidDishes,
  onClose,
  onProceedAnyway,
}) => {
  if (!isOpen || !mode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans animate-fade-in">
      <div 
        className="w-120 rounded-2xl p-6 shadow-2xl text-white flex flex-col gap-5 border border-white/10"
        style={{ backgroundColor: '#d94500' }}
      >
        {/* Modal Header Title */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">😯</span>
          <h3 className="text-xl font-bold tracking-tight">
            {mode === 'EMPTY_PAGES' ? 'Review Menu Structure' : 'Missing Information Required'}
          </h3>
        </div>

        {/* Modal Primary Informational Copy Dynamic Content Blocks */}
        <div className="text-sm leading-relaxed text-orange-50 font-medium overflow-y-auto max-h-60 pr-1">
          {mode === 'EMPTY_PAGES' ? (
            <p className="text-base">
              The <span className="font-extrabold underline">{formatPageNumbersList(emptyPageNumbers)}</span> currently do not have any dish pins mapped on the chart display canvas.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold border-b border-white/20 pb-2">
                The following dishes must be completed before cloud syncing can occur:
              </p>
              <ul className="flex flex-col gap-3 mt-1">
                {invalidDishes.map((dish, idx) => (
                  <li key={idx} className="bg-white/10 rounded-lg p-3 flex flex-col gap-1">
                    <div className="flex justify-between items-center font-bold text-white text-sm">
                      <span>🍽️ {dish.dishName}</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Page {dish.pageNumber}</span>
                    </div>
                    <div className="text-xs text-orange-100 flex gap-1.5 mt-0.5 flex-wrap">
                      <span className="font-semibold text-white">👉  Missing:</span>
                      {dish.missingFields.join(', ')}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Operational Footer Controls (Action Button Grid Blocks) */}
        <div className="flex gap-3 justify-end mt-2 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold rounded-lg border border-white/30 hover:bg-white/10 transition-all duration-200 cursor-pointer"
          >
            {mode === 'EMPTY_PAGES' ? 'Cancel & Go Back' : 'Close and Fix'}
          </button>

          {/* Conditional Variant Upload Trigger (Only rendered if warning type allows bypass overrides) */}
          {mode === 'EMPTY_PAGES' && (
            <button
              onClick={onProceedAnyway}
              className="px-4 py-2 text-sm font-bold rounded-lg bg-white text-brand-secondary hover:bg-orange-50 active:scale-95 transition-all duration-200 shadow-md cursor-pointer"
            >
              Upload Anyway
            </button>
          )}
        </div>
      </div>
    </div>
  );
};