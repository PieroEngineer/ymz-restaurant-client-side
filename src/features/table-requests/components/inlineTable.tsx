import type { OrderItem } from '@/features/table-requests/types/domain.types';

interface OrderRowProps {
  item: OrderItem;
}

export function OrderRow({item}: OrderRowProps) {   // TODO: put the "useMemo"
  return (
    <tr className="hover:bg-orange-50/30 transition-colors">
      {/* 
        The blue vertical line (#001560) is applied only to the right border 
        of the first column cell in table body rows. 
      */}
      <td className="py-1.5 px-2 text-gray-800 text-left border-r-2 border-brand-navy wrap-break-word">
        {item.dishName}
      </td>
      <td className="py-1.5 px-2 text-gray-800 text-center font-medium">
        {item.quantity}
      </td>
    </tr>
  );
};

OrderRow.displayName = 'OrderRow';


interface OrderSummaryTableProps {
  items: OrderItem[];
}

export function OrderSummaryTable({items}: OrderSummaryTableProps) {    // TODO: put the "useMemo"
    // Defensive check: gracefully handle empty arrays
    if (!items || items.length === 0) { /// This situation shouldn't be possible
      return (
        <div
          role="status"
          className={`
            bg-white rounded-2xl border-2 border-brand-primary 
            shadow-[0_4px_16px_rgba(0,0,0,0.25)] text-center 
            text-gray-500 text-sm font-medium
          `}
        >
          No hay comidas en este pedido.  
        </div>
      );
    }

    return (
      <div
        className={`
          bg-white rounded-2xl border-2 border-brand-primary 
          shadow-[0_4px_16px_rgba(0,0,0,0.25)] sm:p-6 
          overflow-x-auto
        `}
      >
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr>
              {/* Header text is bold, with no vertical dividers */}
              <th scope="col" className="pb-1 px-2 font-bold text-gray-900 text-left">
                Comida
              </th>
              <th scope="col" className="pb-1 px-2 font-bold text-gray-900 text-center">
                Cantidad
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <OrderRow 
                // Security & Performance: always use unique, domain-specific IDs over array indexes
                key={item.dishId} 
                item={item} 
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

OrderSummaryTable.displayName = 'OrderSummaryTable';

