import React, { useRef, useEffect } from 'react';
import type { DishItem } from '@/features/menu/types/domain.types';
import type { SyncStatusType } from '@/features/menu/types/support/syncStatus.types';
import { SyncStatusIndicator } from '@/features/menu/components/SyncStatusIndicator';
import type { EditableDishFieldType } from '@/features/menu/types/support/selection.types';
import { centsToDecimal } from '@/shared/utils/moneyConversors';

interface DishChartProps {
  // 📋 Direct injection of sorted structured list items
  dishItems: (DishItem & { orderNumber: number })[];
  activeEditCell: { id: string; field: EditableDishFieldType } | null;
  setActiveEditCell: (cell: { id: string; field: EditableDishFieldType } | null) => void;
  onUpdateItem: (id: string, field: EditableDishFieldType, value: string | boolean, fallbackValue?: number) => void;
  onSeeExtraDetails: (dish: DishItem) => void;
  // 🔌 Notification pipeline to alert the orchestrator when a row is selected
  onRowClicked: (pageId: string) => void;
  // 🔌 New Sync Connection Prop Lines
  syncStatus: SyncStatusType;
  onSyncRequested: () => void;

}

export function DishChart({ 
  dishItems,
  activeEditCell,
  setActiveEditCell,
  onUpdateItem,
  onSeeExtraDetails,
  onRowClicked,
  syncStatus,
  onSyncRequested
}: DishChartProps) {
  // 🎯 Reference anchor to capture the active input node instantly
  const activeInputRef = useRef<HTMLInputElement>(null);

  // ⚡ Auto-focus hook: Whenever the active edit cell changes, ensure the input field is focused
  useEffect(() => { // TODO: Remove the 
    if (activeEditCell && activeInputRef.current) {
      activeInputRef.current.focus();
      activeInputRef.current.select(); // Highlight the existing text for quick overwriting
    }
  }, [activeEditCell]);

  // 🧮 Keyboard Navigation Engine: Handles Tab and Enter loops // TODO: Move to a hook
  const handleKeyDownGridTraverse = (e: React.KeyboardEvent<HTMLInputElement>, currentId: string, currentField: EditableDishFieldType) => { /// currentId is deductible with "findIndex"

    const isTab = e.key === 'Tab';
    const isEnter = e.key === 'Enter';  //TODO: Enter should also jump between rows, not only within one row

    if (!isTab && !isEnter) return;

    // Prevent default browser tab loops so we can control the focus trajectory
    e.preventDefault();

    const idx = dishItems.findIndex(item => item.id === currentId);
    if (idx === -1) return;

    const currentItem = dishItems[idx];

    // 🗺️ Focus Path Checklist Matrix
    if (isTab) {
      if (currentField === 'name') {
        setActiveEditCell({ id: currentId, field: 'priceCents' });
      } else if (currentField === 'priceCents') {
        // Jump to the first column of the next row if available
        if (idx < dishItems.length - 1) {
          setActiveEditCell({ id: dishItems[idx + 1].id, field: 'name' });
        } else {
          setActiveEditCell(null); // Close edit mode if we are on the very last field
        }
      }
    }

    // 🚀 Enter Key Logic: Jumps strictly to incomplete text fields in this row
    if (isEnter) {
      if (currentField === 'name') {
        if (!currentItem.priceCents) setActiveEditCell({ id: currentId, field: 'priceCents' });
        else setActiveEditCell(null);
      } else if (currentField === 'priceCents') {
        setActiveEditCell(null);
      }
    }
  };

  const buttonInStandBy = syncStatus === 'Synchronized' || syncStatus === 'Downloading' || syncStatus === 'Uploading';  // TODO: Move to a hook

  return (
    <div className="w-full h-auto lg:h-full min-h-112 lg:min-h-0 items-center bg-white rounded-2xl lg:rounded-3xl shadow-yummizi border border-brand-navy/5 flex flex-col gap-3 lg:gap-5 p-3 sm:p-4 lg:p-6">
      
      {/* 🚀 TOP CENTER CLOUD WORKFORCE CONTROL SYSTEM BAR HEADER ZONE */}
      <div className="top-4 left-1/2 flex w-full flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 z-20">
        <SyncStatusIndicator status={syncStatus} />
        
        <button
          type="button"
          onClick={onSyncRequested}
          disabled={buttonInStandBy}
          className={`px-4 py-2 sm:py-1 rounded-full text-sm lg:text-md font-sans font-bold transition-all shadow-sm flex items-center justify-center gap-1 border whitespace-nowrap ${
            buttonInStandBy
              ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed shadow-none'
              : 'bg-brand-primary text-white border-brand-primary hover:bg-[#e06114] active:scale-95 cursor-pointer'
          }`}
        >
          📤 Subir Menú
        </button>
      </div>

      <div className="w-full flex-none lg:flex-1 overflow-y-visible lg:overflow-y-auto overflow-x-auto">
        <table className="w-full min-w-2xl lg:min-w-0 border-collapse text-left font-heading text-brand-navy">
          
          <thead>
            <tr className="border-b-2 border-brand-navy/10">
              <th className="pb-3 lg:pb-4 text-sm md:text-lg font-bold tracking-wide uppercase px-3 lg:px-4">N°</th>
              <th className="pb-3 lg:pb-4 text-sm md:text-lg font-bold tracking-wide uppercase border-l border-brand-navy/10 px-3 lg:px-4">Nombre</th>
              <th className="pb-3 lg:pb-4 text-sm md:text-lg font-bold tracking-wide uppercase border-l border-brand-navy/10 px-3 lg:px-4">Costo</th>
              <th className="pb-3 lg:pb-4 text-sm md:text-lg font-bold tracking-wide uppercase border-l border-brand-navy/10 px-3 lg:px-4">Detalles</th>
              <th className="pb-3 lg:pb-4 text-sm md:text-lg font-bold tracking-wide uppercase border-l border-brand-navy/10 px-3 lg:px-4">Dispon.</th>
            </tr>
          </thead>
          
          <tbody className="divide-y-0">
            {dishItems.map((dish) => (
              <tr 
                key={dish.id} 
                /* 🧭 Feature: Clicking anywhere on a row takes you to its respective page */
                onClick={() => onRowClicked(dish.parentPageId)}
                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors h-13 lg:h-14 cursor-pointer"
              >

                {/* 🔢 Dynamic computed index label cell (Static, non-editable) */}
                <td className="font-heading font-black text-center text-base text-brand-primary px-3 select-none">
                  {dish.orderNumber}
                </td>

                {/* 🏷️ ITEM NAME ROW COMPONENT CELL */}
                <td 
                  className="border-l border-brand-navy/10 px-3 lg:px-4"  // |-> X add cursor text 
                  onClick={(e) => {
                    e.stopPropagation(); // Stop row click navigation from resetting things
                    if (activeEditCell?.id !== dish.id || activeEditCell.field !== 'name') {
                      setActiveEditCell({ id: dish.id, field: 'name' });
                    }
                  }}
                >
                  {activeEditCell?.id === dish.id && activeEditCell?.field === 'name' ? (
                    <input
                      ref={activeInputRef}
                      type="text"
                      maxLength={90} // 📏 Guard: Max 90 characters
                      value={dish.name}
                      onChange={(e) => onUpdateItem(dish.id, 'name', e.target.value)}
                      onKeyDown={(e) => handleKeyDownGridTraverse(e, dish.id, 'name')}
                      onBlur={() => setActiveEditCell(null)} // 🔍 Leave cell to revert to text string
                      className="w-full bg-slate-50 border border-brand-primary/30 rounded px-2 py-1 outline-none text-sm font-medium"
                    />
                  ) : (
                    <span className={`block text-sm truncate max-w-48 lg:max-w-55 ${!dish.name && 'text-slate-300 font-normal italic'}`}>
                      {dish.name || 'Tap to name...'}
                    </span>
                  )}
                </td>

                {/* 💵 ITEM COST ROW COMPONENT CELL */}
                <td 
                  className="border-l border-brand-navy/10 px-3 lg:px-4"
                  onClick={() => setActiveEditCell({ id: dish.id, field: 'priceCents' })}
                >
                  {activeEditCell?.id === dish.id && activeEditCell?.field === 'priceCents' ? (
                    <input
                      ref={activeInputRef}
                      type="text"
                      defaultValue={centsToDecimal(dish.priceCents)}
                      onKeyDown={(e) => {
                        onUpdateItem(dish.id, 'priceCents', e.currentTarget.value, dish.priceCents);
                        handleKeyDownGridTraverse(e, dish.id, 'priceCents')
                      }}
                      onBlur={  // Only update state when the user leaves the input
                        (e) => {
                          onUpdateItem(dish.id, 'priceCents', e.target.value, dish.priceCents);
                          setActiveEditCell(null);
                        }
                      }
                      className="w-full bg-slate-50 border border-brand-primary/30 rounded px-2 py-1 outline-none text-sm font-mono font-medium"
                    />
                  ) : (
                    <span className={`block text-sm font-mono ${!dish.priceCents && 'text-slate-300 font-normal italic'}`}>
                      {dish.priceCents ? (dish.type=='COMPLEMENTARY' ? "Complemento" : `$${centsToDecimal(dish.priceCents)}`) : '$0.00'}
                    </span>
                  )}
                </td>

                {/* 🌟 EXTRA DETAILS CELL */}
                <td 
                  className="border-l border-brand-navy/10 px-3 lg:px-4"
                >
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSeeExtraDetails(dish);
                    }}
                    aria-label={`Editar detalles de ${dish.name || 'plato'}`}
                    className="min-w-16 rounded-full px-3 py-1 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 bg-brand-blue hover:bg-brand-navy"
                  >
                    {"Editar"}
                  </button>
                </td>

                {/* ✅ ITEM AVAILABILITY COMPONENT CELL */}
                <td className="border-l border-brand-navy/10 px-3 lg:px-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateItem(dish.id, 'isOutOfStock', !dish.isOutOfStock);
                    }}
                    aria-label={dish.isOutOfStock ? 'Marcar como disponible' : 'Marcar como no disponible'}
                    className={`min-w-16 rounded-full px-3 py-1 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
                      dish.isOutOfStock
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {dish.isOutOfStock ? 'No' : 'Sí'}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
