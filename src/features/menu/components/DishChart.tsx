import React, { useRef, useEffect } from 'react';
import type { DishItem } from '@/features/menu/types/domain.types';
import type { SyncStatusType } from '@/features/menu/types/support/syncStatus.types';
import { SyncStatusIndicator } from '@/features/menu/components/SyncStatusIndicator';
import type { EditableDishField } from '@/features/menu/types/support/selection.types';
import { ensureTimeFormat } from '@/features/menu/helpers/timeValidators';

interface DishChartProps {
  // 📋 Direct injection of sorted structured list items
  items: (DishItem & { orderNumber: number })[];
  activeEditCell: { id: string; field: EditableDishField } | null;
  setActiveEditCell: (cell: { id: string; field: EditableDishField } | null) => void;
  onUpdateItem: (id: string, field: EditableDishField, value: string, fallbackValue?: number) => void;
  // 🔌 Notification pipeline to alert the orchestrator when a row is selected
  onRowClicked: (pageId: string) => void;
  // 🔌 New Sync Connection Prop Lines
  syncStatus: SyncStatusType;
  onSyncRequested: () => void;

}

export function DishChart({ 
  items,
  activeEditCell,
  setActiveEditCell,
  onUpdateItem,
  onRowClicked,
  syncStatus,
  onSyncRequested
}: DishChartProps) {
  // 🎯 Reference anchor to capture the active input node instantly
  const activeInputRef = useRef<HTMLInputElement>(null);

  // ⚡ Auto-focus hook: Whenever the active edit cell changes, ensure the input field is focused
  useEffect(() => {
    if (activeEditCell && activeInputRef.current) {
      activeInputRef.current.focus();
      activeInputRef.current.select(); // Highlight the existing text for quick overwriting
    }
  }, [activeEditCell]);

  // 🧮 Keyboard Navigation Engine: Handles Tab and Enter loops
  const handleKeyDownGridTraverse = (e: React.KeyboardEvent<HTMLInputElement>, currentId: string, currentField: EditableDishField) => { /// currentId is deductible with "findIndex"

    const isTab = e.key === 'Tab';
    const isEnter = e.key === 'Enter';  //TODO: Enter should also jump between rows, not only within one row

    if (!isTab && !isEnter) return;

    // Prevent default browser tab loops so we can control the focus trajectory
    e.preventDefault();

    const idx = items.findIndex(item => item.id === currentId);
    if (idx === -1) return;

    const currentItem = items[idx];

    // 🗺️ Focus Path Checklist Matrix
    if (isTab) {
      if (currentField === 'name') {
        setActiveEditCell({ id: currentId, field: 'priceCents' });
      } else if (currentField === 'priceCents') {
        setActiveEditCell({ id: currentId, field: 'prepTime' });
      } else if (currentField === 'prepTime') {
        // Jump to the first column of the next row if available
        if (idx < items.length - 1) {
          setActiveEditCell({ id: items[idx + 1].id, field: 'name' });
        } else {
          setActiveEditCell(null); // Close edit mode if we are on the very last field
        }
      }
    }

    // 🚀 Enter Key Logic: Jumps strictly to incomplete text fields in this row
    if (isEnter) {
      if (currentField === 'name') {
        if (!currentItem.priceCents) setActiveEditCell({ id: currentId, field: 'priceCents' });
        else if (!currentItem.prepTime) setActiveEditCell({ id: currentId, field: 'prepTime' });
        else setActiveEditCell(null);
      } else if (currentField === 'priceCents') {
        if (!currentItem.prepTime) setActiveEditCell({ id: currentId, field: 'prepTime' });
        else setActiveEditCell(null);
      } else if (currentField === 'prepTime') {
        setActiveEditCell(null);
      }
    }
  };

  return (
    <div className="w-full h-full items-center bg-white rounded-3xl shadow-yummizi border border-brand-navy/5 flex flex-col gap-5 p-6">
      
      {/* 🚀 TOP CENTER CLOUD WORKFORCE CONTROL SYSTEM BAR HEADER ZONE */}
      <div className="top-4 left-1/2 flex items-center gap-3 z-20">
        <SyncStatusIndicator status={syncStatus} />
        
        <button
          type="button"
          onClick={onSyncRequested}
          disabled={syncStatus === 'Synchronized' || syncStatus === 'Loading'}
          className={`px-4 py-1 rounded-full text-md font-sans font-bold transition-all shadow-sm flex items-center gap-1 border ${
            syncStatus === 'Synchronized' || syncStatus === 'Loading'
              ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed shadow-none'
              : 'bg-brand-primary text-white border-brand-primary hover:bg-[#e06114] active:scale-95 cursor-pointer'
          }`}
        >
          📤 Subir Menú
        </button>
      </div>

      <div className="w-full flex-1 overflow-y-scroll overflow-x-auto">
        <table className="w-full border-collapse text-left font-heading text-brand-navy">
          
          <thead>
            <tr className="border-b-2 border-brand-navy/10">
              <th className="pb-4 text-base md:text-lg font-bold tracking-wide uppercase px-4">N°</th>
              <th className="pb-4 text-base md:text-lg font-bold tracking-wide uppercase border-l border-brand-navy/10 px-4">Nombre</th>
              <th className="pb-4 text-base md:text-lg font-bold tracking-wide uppercase border-l border-brand-navy/10 px-4">Costo</th>
              <th className="pb-4 text-base md:text-lg font-bold tracking-wide uppercase border-l border-brand-navy/10 px-4">Tiempo de prep.</th>
            </tr>
          </thead>
          
          <tbody className="divide-y-0">
            {items.map((dish) => (
              <tr 
                key={dish.id} 
                /* 🧭 Feature: Clicking anywhere on a row takes you to its respective page */
                onClick={() => onRowClicked(dish.parentPageId)}
                className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors h-14 cursor-pointer"
              >

                {/* 🔢 Dynamic computed index label cell (Static, non-editable) */}
                <td className="font-heading font-black text-center text-base text-brand-primary px-3 select-none">
                  {dish.orderNumber}
                </td>

                {/* 🏷️ ITEM NAME ROW COMPONENT CELL */}
                <td 
                  className="border-l border-brand-navy/10 px-4"  // |-> X add cursor text 
                  onClick={(e) => {
                    e.stopPropagation(); // Stop row click navigation from resetting things
                    setActiveEditCell({ id: dish.id, field: 'name' });
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
                    <span className={`block text-sm truncate max-w-55 ${!dish.name && 'text-slate-300 font-normal italic'}`}>
                      {dish.name || 'Tap to name...'}
                    </span>
                  )}
                </td>

                {/* 💵 ITEM COST ROW COMPONENT CELL */}
                <td 
                  className="border-l border-brand-navy/10 px-4"
                  onClick={() => setActiveEditCell({ id: dish.id, field: 'priceCents' })}
                >
                  {activeEditCell?.id === dish.id && activeEditCell?.field === 'priceCents' ? (
                    // <input //X If the bellow one works, delete this
                    //   ref={activeInputRef}
                    //   type="text"
                    //   value={dish.priceCents}
                    //   onChange={(e) => onUpdateItem(dish.id, 'priceCents', validateCostInput(e.target.value))}
                    //   onKeyDown={(e) => handleKeyDownGridTraverse(e, dish.id, 'priceCents')}
                    //   onBlur={() => setActiveEditCell(null)}
                    //   className="w-full bg-slate-50 border border-brand-primary/30 rounded px-2 py-1 outline-none text-sm font-mono font-medium"
                    // />
                    <input
                      ref={activeInputRef}
                      type="text"
                      defaultValue={dish.priceCents}
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
                      {dish.priceCents ? `$${dish.priceCents}` : '$0.00'}
                    </span>
                  )}
                </td>

                {/* ⏱️ ITEM PREPARATION TIME COMPONENT CELL */}
                <td 
                  className="border-l border-brand-navy/10 px-4"
                  onClick={() => setActiveEditCell({ id: dish.id, field: 'prepTime' })}
                >
                  {activeEditCell?.id === dish.id && activeEditCell?.field === 'prepTime' ? (
                    <input
                      ref={activeInputRef}
                      type="text"
                      value={dish.prepTime}
                      onChange={(e) => onUpdateItem(dish.id, 'prepTime', ensureTimeFormat(e.target.value))}
                      onKeyDown={(e) => handleKeyDownGridTraverse(e, dish.id, 'prepTime')}
                      onBlur={() => setActiveEditCell(null)}
                      className="w-full bg-slate-50 border border-brand-primary/30 rounded px-2 py-1 outline-none text-sm font-medium"
                    />
                  ) : (
                    <span className={`block text-sm ${!dish.prepTime && 'text-slate-300 font-normal italic'}`}>
                      {dish.prepTime ? `${dish.prepTime} min` : '0 min'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}