import { useSuspenseQuery } from '@tanstack/react-query';
import { type OrderPreselectionPayload, type TableRequestPayload } from '@/features/table-requests/types/api.types';
import { MOCK_MENU_RESTAURANT_ID } from '@/features/menu/api/menuApi';
import { TableRequestCard } from '@/features/table-requests/components/TableRequestCard';
import { axiosClient } from '@/shared/api/axiosClient';
import { toDomainOrder, toDomainTableRequest } from '@/features/table-requests/api/mappers/inboundMappers';
import type { Order, TableRequest } from '@/features/table-requests/types/domain.types';
import { useRequests } from '@/features/table-requests/hooks/useRequests';
import { useOrders } from '@/features/table-requests/hooks/useOrders';
import { useRealTimeDashboard } from '@/features/table-requests/hooks/useRealTimeDashboard';
import type { CardInfoItem } from '@/features/table-requests/types/support/cardFields.types';

export function RequestDashboard() {
  const requestQueryKey = ['restaurant', MOCK_MENU_RESTAURANT_ID, 'active-requests'];
  const orderQueryKey = ['restaurant', MOCK_MENU_RESTAURANT_ID, 'active-orders'];

  // Initial load fetches currently open requests via Axios
  const { data: tableRequests } = useSuspenseQuery<TableRequest[]>({  //  TODO: Move inside the hook "useRequests"
    queryKey: requestQueryKey,
    queryFn: async () => {
      const response = await axiosClient.get<TableRequestPayload[]>(`requests/${MOCK_MENU_RESTAURANT_ID}`);
      console.log(`🔎  Raw request data :\n ${JSON.stringify(response.data)}`)
      return response.data.map(toDomainTableRequest);
    },
  });

  const { data: customerOrders } = useSuspenseQuery<Order[]>({  //  TODO: Move inside the hook "useOrders"
    queryKey: orderQueryKey,
    queryFn: async () => {
      const response = await axiosClient.get<OrderPreselectionPayload[]>(`payments/${MOCK_MENU_RESTAURANT_ID}`);
      console.log(`🔎  Raw Order data :\n ${JSON.stringify(response.data)}`)
      return response.data.map(toDomainOrder);
    },
  }); 
  
  // TODO: Analyze if the above double GET request can be unified 

  const requests = useRequests(tableRequests);
  const orders = useOrders();
  
  // Mount the real-time WebSocket listener dedicated to the restaurant operations channel
  // const { updateRequestStatus } = useRestaurantLiveRequests(MOCK_MENU_RESTAURANT_ID, tableRequests);
  useRealTimeDashboard(requests.onRequestUpdate, orders.onOrderUpdate)

  const handleDecline = (id: string) => {
    console.log(`Declined request: ${id}`);
  };

  if (tableRequests.length === 0 && customerOrders.length === 0) {
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
        {tableRequests.map((tableRequest) => {

          const relatedInfo: CardInfoItem[] = [
            {nomination: 'Personas', value: String(tableRequest.groupSize)},
            {nomination: 'Llegaría en', value: String(tableRequest.arrivlaTime)}
          ] ///, {nomination: 'A', value: ''};
          
          return <TableRequestCard
            key={tableRequest.requestId}
            requestId = {tableRequest.requestId}
            userName = {tableRequest.userName}
            state = {tableRequest.state}
            checkpointTimestamp = {tableRequest.onQueuedTimestamp}
            relatedInfo = {relatedInfo}
            onAcceptCardFromQueue={requests.updateRequestStatus}
            onDeclineRequest={handleDecline}
          />  
        })}
        {customerOrders.map((customerOrder) => {

          console.log(`🔎📃  Customer Order :\n ${JSON.stringify(customerOrder)}`)

          const relatedInfo: CardInfoItem[] = [
            {nomination: 'Personas', value: String(customerOrder.groupSize)},
            {nomination: 'Llegaría en', value: String(customerOrder.arrivalTimeInMinutes)},
            {nomination: 'Pago', value: String(customerOrder.totalCostInCents)}
          ] ///, {nomination: 'A', value: ''};

          const expectedArrivalTime = (customerOrder.arrivalTimeInMinutes*60_000) + customerOrder.onPaidTimeStamp;  // TODO: FIx the minutes difference here (It's giving an exrta minute when reload the page)
          
          return <TableRequestCard
            key={customerOrder.requestId}                 // TODO: Analize if it's ok if it works with request ID or I should create an order ID (Mayber just change the name in backend)  
            requestId = {customerOrder.requestId}  //
            userName = {customerOrder.userName}
            state = {'PAID'}
            checkpointTimestamp = {expectedArrivalTime}
            relatedInfo = {relatedInfo}
            selectedOrder = {customerOrder.orderSelections}
            onAcceptCardFromQueue={requests.updateRequestStatus}
            onDeclineRequest={handleDecline}
          />  
        })}
      </div>
    </div>
  );
};