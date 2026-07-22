import type { CardInfoItem } from "@/features/table-requests/types/support/cardFields.types";

interface InfoGridProps {
  items: CardInfoItem[]
}

export const InfoGrid = ({ items }: InfoGridProps) => {
  // Defensive programming: return null early if there's no data to process
  if (!items || items.length === 0) {
    return (
      <div className="text-center p-6 text-gray-400 text-sm" role="status">
        No information available.
      </div>
    );
  }

  // Pre-calculate length for the render loop optimization
  const totalItems = items.length;

  return (
    <ul 
      className={`
        grid grid-cols-1 sm:grid-cols-2 
        gap-x-8 gap-y-6 
        w-full max-w-4xl mx-auto p-6
      `}
    >
      {items.map((item, index) => {
        // A row has only one item if it's the last element of an odd-length array
        const isCentredRow = index === totalItems - 1 && totalItems % 2 !== 0;

        return (
            <li
                className={`
                    flex flex-col items-center text-center p-4 transition-all duration-200
                    ${isCentredRow ? 'sm:col-span-2 justify-self-center w-full max-w-md' : ''}
                `}
                >
                {/* Nomination (Label) */}
                <span className="text-gray-500 text-sm tracking-wide select-none font-accents">
                    {item.nomination}
                </span>

                {/* Value */}
                <span className="text-gray-900 text-sm font-bold mt-1 wrap-break-word font-accents">
                    {item.value}
                </span>

                {/* Short, thin, and gray horizontal decorative line */}
                <div 
                    className="w-12 h-px bg-gray-200 mt-4 transition-colors hover:bg-gray-300" 
                    aria-hidden="true" 
                />
            </li>

        );
      })}
    </ul>
  );
};