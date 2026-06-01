// Ready-built structural object schema definition contract for dynamic data injections later
interface DishItem {
  id: string;
  name: string;
  category: string;
  price: string;
  status: string;
}

interface DishChartProps {
  items?: DishItem[];
  onEditItem?: (id: string, updatedField: Partial<DishItem>) => void;
}

export function DishChart({ items = [], onEditItem }: DishChartProps) {
  // Static placeholder rows array to format the visual interface layout safely ahead of dynamic links
  const mockRows = items.length > 0 ? items : [
    { id: '1', name: 'Filet Mignon Supreme', category: 'Grill', price: '$34.00', status: 'Active' },
    { id: '2', name: 'Truffle Mushroom Risotto', category: 'Pasta', price: '$26.50', status: 'Active' },
    { id: '3', name: 'Atlantic Salmon Tartare', category: 'Appetizer', price: '$19.00', status: 'Hold' },
    { id: '4', name: 'Valrhona Lava Soufflé', category: 'Dessert', price: '$14.00', status: 'Active' },
  ];

  return (
    <div className="w-full h-full bg-white rounded-3xl shadow-yummizi border border-brand-navy/5 overflow-hidden flex flex-col p-6">
      <div className="w-full flex-1 overflow-auto">
        <table className="w-full border-collapse text-left font-heading text-brand-navy">
          
          <thead>
            <tr className="border-b-2 border-brand-navy/10">
              <th className="pb-4 text-base md:text-lg font-bold tracking-wide uppercase px-4">Dish Item</th>
              <th className="pb-4 text-base md:text-lg font-bold tracking-wide uppercase border-l border-brand-navy/10 px-4">Section</th>
              <th className="pb-4 text-base md:text-lg font-bold tracking-wide uppercase border-l border-brand-navy/10 px-4">Valuation</th>
              <th className="pb-4 text-base md:text-lg font-bold tracking-wide uppercase border-l border-brand-navy/10 px-4">Status</th>
            </tr>
          </thead>
          
          <tbody className="divide-y-0">
            {mockRows.map((dish) => (
              <tr 
                key={dish.id} 
                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                onClick={() => onEditItem?.(dish.id, {})}
              >
                <td className="py-4 font-bold text-sm px-4 whitespace-nowrap">{dish.name}</td>
                <td className="py-4 text-sm border-l border-brand-navy/10 px-4 whitespace-nowrap">{dish.category}</td>
                <td className="py-4 text-sm border-l border-brand-navy/10 px-4 font-mono whitespace-nowrap">{dish.price}</td>
                <td className="py-4 text-sm border-l border-brand-navy/10 px-4 whitespace-nowrap">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    dish.status === 'Active' ? 'bg-[#00bf63]/10 text-[#00bf63]' : 'bg-brand-primary/10 text-brand-primary'
                  }`}>
                    {dish.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}