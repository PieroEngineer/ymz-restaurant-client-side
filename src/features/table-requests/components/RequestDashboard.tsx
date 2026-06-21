import React from 'react';
import { TableRequestCard } from '@/features/table-requests/components/TableRequestCard';
import { type TableRequest } from '@/features/table-requests/types';

interface RequestDashboardProps {
  requests: TableRequest[];
}

export const RequestDashboard: React.FC<RequestDashboardProps> = ({ requests }) => {
  
  const handleAccept = (id: string) => {
    console.log(`Accepted request: ${id}`);
  };

  const handleDecline = (id: string) => {
    console.log(`Declined request: ${id}`);
  };

  if (requests.length === 0) {
    return (
      <div className="text-center max-w-sm animate-fade-in">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <span className="absolute inset-0 rounded-full bg-brand-primary/20 animate-ping" />
          <span className="relative w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-brand-primary" />
          </span>
        </div>
        <h3 className="font-heading font-bold text-brand-navy text-lg mb-1">
          Live Stream Workspace Active
        </h3>
        <p className="text-brand-navy/50 font-sans text-xs leading-relaxed">
          Waiting for incoming live table requests from clients...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar">
      {/* Masonry Grid Optimization: 
        Using columns properties allows dynamic item heights to fit together neatly vertically 
        without creating giant empty spaces beneath shorter cards.
      */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 [column-fill:auto]">
        {requests.map((request) => (
          <TableRequestCard
            key={request.id}
            request={request}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))}
      </div>
    </div>
  );
};