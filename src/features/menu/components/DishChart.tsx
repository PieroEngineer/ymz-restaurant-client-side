import type { DishItem } from '@/features/menu/components/MenuDisplay';


interface DishChartProps {
  // 📋 Direct injection of sorted structured list items
  items: (DishItem & { orderNumber: number })[];
  activeEditCell: { id: string; field: 'name' | 'cost' | 'prepTime' } | null;
  setActiveEditCell: (cell: { id: string; field: 'name' | 'cost' | 'prepTime' } | null) => void;
  onUpdateItem: (id: string, field: 'name' | 'cost' | 'prepTime', value: string) => void;
}

export function DishChart({ items, activeEditCell, setActiveEditCell, onUpdateItem }: DishChartProps) {
  
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
              <tr key={dish.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors h-14">
                
                {/* 🔢 Dynamic computed index label cell (Static, non-editable) */}
                <td className="font-heading font-black text-center text-base text-brand-primary px-3 select-none">
                  {dish.orderNumber}
                </td>

                {/* 🏷️ ITEM NAME ROW COMPONENT CELL */}
                <td 
                  className="border-l border-brand-navy/10 px-4 cursor-text"
                  onClick={() => setActiveEditCell({ id: dish.id, field: 'name' })}
                >
                  {activeEditCell?.id === dish.id && activeEditCell?.field === 'name' ? (
                    <input
                      type="text"
                      autoFocus
                      maxLength={90} // 📏 Guard: Max 90 characters
                      value={dish.name}
                      onChange={(e) => onUpdateItem(dish.id, 'name', e.target.value)}
                      onBlur={() => setActiveEditCell(null)} // 🔍 Leave cell to revert to text string
                      className="w-full bg-slate-50 border border-brand-primary/30 rounded px-2 py-1 outline-none text-sm font-medium"
                      placeholder="Enter dish name..."
                    />
                  ) : (
                    <span className={`block text-sm truncate max-w-55 ${!dish.name && 'text-slate-300 font-normal italic'}`}>
                      {dish.name || 'Tap to name...'}
                    </span>
                  )}
                </td>

                {/* 💵 ITEM COST ROW COMPONENT CELL */}
                <td 
                  className="border-l border-brand-navy/10 px-4 cursor-text"
                  onClick={() => setActiveEditCell({ id: dish.id, field: 'cost' })}
                >
                  {activeEditCell?.id === dish.id && activeEditCell?.field === 'cost' ? (
                    <input
                      type="text"
                      autoFocus
                      value={dish.cost}
                      onChange={(e) => onUpdateItem(dish.id, 'cost', validateCostInput(e.target.value))}
                      onBlur={() => setActiveEditCell(null)}
                      className="w-full bg-slate-50 border border-brand-primary/30 rounded px-2 py-1 outline-none text-sm font-mono font-medium"
                      placeholder="0.00"
                    />
                  ) : (
                    <span className={`block text-sm font-mono ${!dish.cost && 'text-slate-300 font-normal italic'}`}>
                      {dish.cost ? `$${dish.cost}` : '$0.00'}
                    </span>
                  )}
                </td>

                {/* ⏱️ ITEM PREPARATION TIME COMPONENT CELL */}
                <td 
                  className="border-l border-brand-navy/10 px-4 cursor-text"
                  onClick={() => setActiveEditCell({ id: dish.id, field: 'prepTime' })}
                >
                  {activeEditCell?.id === dish.id && activeEditCell?.field === 'prepTime' ? (
                    <input
                      type="text"
                      autoFocus
                      value={dish.prepTime}
                      onChange={(e) => onUpdateItem(dish.id, 'prepTime', validatePrepTimeInput(e.target.value))}
                      onBlur={() => setActiveEditCell(null)}
                      className="w-full bg-slate-50 border border-brand-primary/30 rounded px-2 py-1 outline-none text-sm font-medium"
                      placeholder="Mins"
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