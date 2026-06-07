import React, { useRef, useEffect } from 'react';
import type { DishItem } from '@/features/menu/components/MenuDisplay';


interface DishChartProps {
  // 📋 Direct injection of sorted structured list items
  items: (DishItem & { orderNumber: number })[];
  activeEditCell: { id: string; field: 'name' | 'cost' | 'prepTime' } | null;
  setActiveEditCell: (cell: { id: string; field: 'name' | 'cost' | 'prepTime' } | null) => void;
  onUpdateItem: (id: string, field: 'name' | 'cost' | 'prepTime', value: string) => void;
  // 🔌 Notification pipeline to alert the orchestrator when a row is selected
  onRowClicked: (pageIndex: number) => void;
}

export function DishChart({ items, activeEditCell, setActiveEditCell, onUpdateItem, onRowClicked }: DishChartProps) {
  // 🎯 Reference anchor to capture the active input node instantly
  const activeInputRef = useRef<HTMLInputElement>(null);

  // ⚡ Auto-focus hook: Whenever the active edit cell changes, ensure the input field is focused
  useEffect(() => {
    if (activeEditCell && activeInputRef.current) {
      activeInputRef.current.focus();
      activeInputRef.current.select(); // Highlight the existing text for quick overwriting
    }
  }, [activeEditCell]);
  
  // 📝 Validation Guard: Restricts the Cost string value to maximum of 2 decimal places
  const validateCostInput = (val: string): string => {
    // Allows digits, and a optional single decimal dot followed by up to 2 decimal places max
    const sanitized = val.replace(/[^0-9.]/g, '');
    const split = sanitized.split('.');
    if (split.length > 2) return `${split[0]}.${split[1]}`;
    if (split[1] && split[1].length > 2) return `${split[0]}.${split[1].slice(0, 2)}`;
    return sanitized;
  };

  // 📝 Validation Guard: Restricts the Prep Time to whole numbers only
  const validatePrepTimeInput = (val: string): string => {
    return val.replace(/[^0-9]/g, ''); // Strip out non-integers entirely
  };

  // 🧮 Keyboard Navigation Engine: Handles Tab and Enter loops
  const handleKeyDownGridTraverse = (e: React.KeyboardEvent<HTMLInputElement>, currentId: string, currentField: 'name' | 'cost' | 'prepTime') => {
    const isTab = e.key === 'Tab';
    const isEnter = e.key === 'Enter';  //TODO: Enter should also jump between rows, not only within one row

    if (!isTab && !isEnter) return;

    // Prevent default browser tab loops so we can control the focus trajectory
    e.preventDefault();

    const currentItemIndex = items.findIndex(item => item.id === currentId);
    if (currentItemIndex === -1) return;

    const currentItem = items[currentItemIndex];

    // 🗺️ Focus Path Checklist Matrix
    if (isTab) {
      if (currentField === 'name') {
        setActiveEditCell({ id: currentId, field: 'cost' });
      } else if (currentField === 'cost') {
        setActiveEditCell({ id: currentId, field: 'prepTime' });
      } else if (currentField === 'prepTime') {
        // Jump to the first column of the next row if available
        if (currentItemIndex < items.length - 1) {
          setActiveEditCell({ id: items[currentItemIndex + 1].id, field: 'name' });
        } else {
          setActiveEditCell(null); // Close edit mode if we are on the very last field
        }
      }
    }

    // 🚀 Enter Key Logic: Jumps strictly to incomplete text fields in this row
    if (isEnter) {
      if (currentField === 'name') {
        if (!currentItem.cost) setActiveEditCell({ id: currentId, field: 'cost' });
        else if (!currentItem.prepTime) setActiveEditCell({ id: currentId, field: 'prepTime' });
        else setActiveEditCell(null);
      } else if (currentField === 'cost') {
        if (!currentItem.prepTime) setActiveEditCell({ id: currentId, field: 'prepTime' });
        else setActiveEditCell(null);
      } else if (currentField === 'prepTime') {
        setActiveEditCell(null);
      }
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-3xl shadow-yummizi border border-brand-navy/5 flex flex-col p-6">
      <div className="w-full flex-1 overflow-y-scroll">
        <table className="w-full border-collapse text-left font-heading text-brand-navy">
          
          <thead>
            <tr className="border-b-2 border-brand-navy/10">
              <th className="pb-4 text-base md:text-lg font-bold tracking-wide uppercase px-4">N°</th>
              <th className="pb-4 text-base md:text-lg font-bold tracking-wide uppercase border-l border-brand-navy/10 px-4">Name</th>
              <th className="pb-4 text-base md:text-lg font-bold tracking-wide uppercase border-l border-brand-navy/10 px-4">Cost</th>
              <th className="pb-4 text-base md:text-lg font-bold tracking-wide uppercase border-l border-brand-navy/10 px-4">Prep. time</th>
            </tr>
          </thead>
          
          <tbody className="divide-y-0">
            {items.map((dish) => (
              <tr 
                key={dish.id} 
                /* 🧭 Feature: Clicking anywhere on a row takes you to its respective page */
                onClick={() => onRowClicked(dish.pageIndex)}
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
                      //XautoFocus
                      maxLength={90} // 📏 Guard: Max 90 characters
                      value={dish.name}
                      onChange={(e) => onUpdateItem(dish.id, 'name', e.target.value)}
                      onKeyDown={(e) => handleKeyDownGridTraverse(e, dish.id, 'name')}
                      onBlur={() => setActiveEditCell(null)} // 🔍 Leave cell to revert to text string
                      className="w-full bg-slate-50 border border-brand-primary/30 rounded px-2 py-1 outline-none text-sm font-medium"
                      //Xplaceholder="Enter dish name..."
                    />
                  ) : (
                    <span className={`block text-sm truncate max-w-55 ${!dish.name && 'text-slate-300 font-normal italic'}`}>
                      {dish.name || 'Tap to name...'}
                    </span>
                  )}
                </td>

                {/* 💵 ITEM COST ROW COMPONENT CELL */}
                <td 
                  className="border-l border-brand-navy/10 px-4"  ///
                  onClick={() => setActiveEditCell({ id: dish.id, field: 'cost' })}
                >
                  {activeEditCell?.id === dish.id && activeEditCell?.field === 'cost' ? (
                    <input
                      ref={activeInputRef}
                      type="text"
                      //XautoFocus
                      value={dish.cost}
                      onChange={(e) => onUpdateItem(dish.id, 'cost', validateCostInput(e.target.value))}
                      onKeyDown={(e) => handleKeyDownGridTraverse(e, dish.id, 'cost')}
                      onBlur={() => setActiveEditCell(null)}
                      className="w-full bg-slate-50 border border-brand-primary/30 rounded px-2 py-1 outline-none text-sm font-mono font-medium"
                    />
                  ) : (
                    <span className={`block text-sm font-mono ${!dish.cost && 'text-slate-300 font-normal italic'}`}>
                      {dish.cost ? `$${dish.cost}` : '$0.00'}
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
                      //XautoFocus
                      value={dish.prepTime}
                      onChange={(e) => onUpdateItem(dish.id, 'prepTime', validatePrepTimeInput(e.target.value))}
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