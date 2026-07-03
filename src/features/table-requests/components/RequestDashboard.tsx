import React, { useState, useEffect } from 'react';
import { TableRequestCard } from '@/features/table-requests/components/TableRequestCard';
import { type TableRequest } from '@/features/table-requests/types';

interface RequestDashboardProps {
  requests: TableRequest[];
}

export const RequestDashboard: React.FC<RequestDashboardProps> = ({ requests }) => {  // TODO: remove the "React.FC" and use the modern way
  const [columnCount, setColumnCount] = useState(3);

  // High-Performance Breakpoint Listener
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setColumnCount(1);       // Mobile
      else if (width < 1024) setColumnCount(2);  // Tablet
      else if (width < 1280) setColumnCount(3);  // Desktop
      else setColumnCount(4);                    // Large Desktop
    };

    handleResize(); // Initialize on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (requests.length === 0) {
    return (
      <div className="text-center max-w-sm">
        <p className="text-brand-navy/50 font-sans text-xs">No active requests.</p>
      </div>
    );
  }

  // Round-Robin Distribution Engine
  // Creates an array of empty arrays based on column count
  const columns: TableRequest[][] = Array.from({ length: columnCount }, () => []);
  
  // Distribute items to columns while preserving left-to-right, top-to-bottom rhythm
  requests.forEach((request, index) => {
    columns[index % columnCount].push(request);
  });

  return (
    <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      {/* Horizontal Flex Container containing independent vertical columns */}
      <div className="flex flex-row gap-4 items-start w-full">
        {columns.map((colItems, colIndex) => (
          <div 
            key={colIndex} 
            className="flex flex-col gap-4 flex-1 min-w-0"
          >
            {colItems.map((request) => (
              <TableRequestCard
                key={request.id}
                request={request}
                onAccept={(id) => console.log('Accept', id)}
                onDecline={(id) => console.log('Decline', id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};