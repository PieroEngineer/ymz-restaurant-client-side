import { useSuspenseQuery } from '@tanstack/react-query';
import { type TableRequestPayload } from '@/features/table-requests/types';
import { MOCK_MENU_RESTAURANT_ID } from '@/features/menu/api/menuApi';
import { TableRequestCard } from '@/features/table-requests/components/TableRequestCard';
import { useRestaurantLiveRequests } from '@/features/table-requests/hooks/useRestaurantLiveRequests';
import { axiosClient } from '@/shared/api/axiosClient';

export function RequestDashboard() {
  const queryKey = ['restaurant', MOCK_MENU_RESTAURANT_ID, 'active-requests'];

  // Initial load fetches currently open requests via Axios
  const { data: tableRequests } = useSuspenseQuery<TableRequestPayload[]>({
    queryKey,
    queryFn: async () => {
      const response = await axiosClient.get(`requests/${MOCK_MENU_RESTAURANT_ID}`);
      return response.data; // Expecting TableRequestPayload[]
    },
  });

  console.log(`Snapshot of requests:\n ${tableRequests}`)

  // Mount the real-time WebSocket listener dedicated to the restaurant operations channel
  /*const { updateRequestStatus } =*/ useRestaurantLiveRequests(MOCK_MENU_RESTAURANT_ID);

  const handleAccept = (id: string) => {
    console.log(`Accepted request: ${id}`);
  };

  const handleDecline = (id: string) => {
    console.log(`Declined request: ${id}`);
  };

  if (tableRequests.length === 0) {
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
        {tableRequests.map((tableRequest) => (
          <TableRequestCard
            key={tableRequest.requestId}
            request={tableRequest}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))}
      </div>
    </div>
  );
};