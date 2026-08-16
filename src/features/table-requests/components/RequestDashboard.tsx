import { TableRequestCard } from '@/features/table-requests/components/TableRequestCard';
import { useRequests } from '@/features/table-requests/hooks/useRequests';
import { useOrders } from '@/features/table-requests/hooks/useOrders';
import { useRealTimeDashboard } from '@/features/table-requests/hooks/useRealTimeDashboard';
import type { CardInfoItem } from '@/features/table-requests/types/support/cardFields.types';
import { centsToDecimal } from '@/shared/utils/moneyConversors';

export function RequestDashboard() {
  // TODO: Analyze if the above double GET request can be unified

  const requests = useRequests();
  const orders = useOrders();
  
  // Mount the real-time WebSocket listener dedicated to the restaurant operations channel
  // const { updateRequestStatus } = useRestaurantLiveRequests(MOCK_MENU_RESTAURANT_ID, tableRequests);
  useRealTimeDashboard(requests.onRequestUpdated, orders.onOrderUpdate)

  const handleDecline = (id: string) => {
    console.log(`Declined request: ${id}`);
  };

  // if (requests.currentState.length === 0 && orders.currentState.length === 0) {
  //   return (
  //     <div className="text-center max-w-sm animate-fade-in">
  //       <div className="relative w-12 h-12 mx-auto mb-4">
  //         <span className="absolute inset-0 rounded-full bg-brand-primary/20 animate-ping" />
  //         <span className="relative w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center">
  //           <span className="w-3 h-3 rounded-full bg-brand-primary" />
  //         </span>
  //       </div>
  //       <h3 className="font-heading font-bold text-brand-navy text-lg mb-1">
  //         Live Stream Workspace Active
  //       </h3>
  //       <p className="text-brand-navy/50 font-sans text-xs leading-relaxed">
  //         Waiting for incoming live table requests from clients...
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar">

      {/* Order block */}
      <div className="flex flex-wrap items-start gap-4">
        {/*X Mockup*/}
        <div className="min-w-70 basis-70 flex-1 max-w-full">
          <TableRequestCard
            key={'123'}
            requestId = {'123'}
            userName = {'Mockup'}
            state = {'PAID'}
            checkpointTimestamp = {Date.now() + 5*60_000}
            relatedInfo = {[
              {nomination: 'ABC', value: "ABCDE"},
              {nomination: 'EFG', value: "HIGJK"},
              {nomination: 'Pago', value: String(centsToDecimal(12345))},
            ]}
            selectedOrder = {[
              {dishId: 'mockup-dish', quantity: 2, dishName: "Visteck a lo pobre con moyabamba", historicalUnitPriceInCents: 125},
              {dishId: 'mockup-dish', quantity: 5, dishName: "mockup", historicalUnitPriceInCents: 12},
              {dishId: 'mockup-dish', quantity: 2, dishName: "mockup", historicalUnitPriceInCents: 1},
            ]}
            onAcceptCardFromQueue={requests.updateRequestStatus}
            onDeclineRequest={handleDecline}
          />
        </div>

        {/*X Mockup*/}
        <div className="min-w-70 basis-70 flex-1 max-w-full">
          <TableRequestCard
            key={'123'}
            requestId = {'123'}
            userName = {'Mockup'}
            state = {'PAID'}
            checkpointTimestamp = {Date.now() + 5*60_000}
            relatedInfo = {[
              {nomination: 'ABC', value: "ABCDE"},
              {nomination: 'EFG', value: "HIGJK"},
              {nomination: 'Pago', value: String(centsToDecimal(12345))},
            ]}
            selectedOrder = {[
              {dishId: 'mockup-dish', quantity: 2, dishName: "Visteck a lo pobre con moyabamba", historicalUnitPriceInCents: 125},
              {dishId: 'mockup-dish', quantity: 5, dishName: "mockup", historicalUnitPriceInCents: 12},
              {dishId: 'mockup-dish', quantity: 2, dishName: "mockup", historicalUnitPriceInCents: 1},
            ]}
            onAcceptCardFromQueue={requests.updateRequestStatus}
            onDeclineRequest={handleDecline}
          />
        </div>

        {/*X Mockup*/}
        <div className="min-w-70 basis-70 flex-1 max-w-full">
          <TableRequestCard
            key={'123'}
            requestId = {'123'}
            userName = {'Mockup'}
            state = {'PAID'}
            checkpointTimestamp = {Date.now() + 5*60_000}
            relatedInfo = {[
              {nomination: 'ABC', value: "ABCDE"},
              {nomination: 'EFG', value: "HIGJK"},
              {nomination: 'Pago', value: String(centsToDecimal(12345))},
            ]}
            selectedOrder = {[
              {dishId: 'mockup-dish', quantity: 2, dishName: "Visteck a lo pobre con moyabamba", historicalUnitPriceInCents: 125},
              {dishId: 'mockup-dish', quantity: 5, dishName: "mockup", historicalUnitPriceInCents: 12},
              {dishId: 'mockup-dish', quantity: 2, dishName: "mockup", historicalUnitPriceInCents: 1},
            ]}
            onAcceptCardFromQueue={requests.updateRequestStatus}
            onDeclineRequest={handleDecline}
          />
        </div>

        {/*X Mockup*/}
        <div className="min-w-70 basis-70 flex-1 max-w-full">
          <TableRequestCard
            key={'123'}
            requestId = {'123'}
            userName = {'Mockup'}
            state = {'PAID'}
            checkpointTimestamp = {Date.now() + 5*60_000}
            relatedInfo = {[
              {nomination: 'ABC', value: "ABCDE"},
              {nomination: 'EFG', value: "HIGJK"},
              {nomination: 'Pago', value: String(centsToDecimal(12345))},
            ]}
            selectedOrder = {[
              {dishId: 'mockup-dish', quantity: 2, dishName: "Visteck a lo pobre con moyabamba", historicalUnitPriceInCents: 125},
              {dishId: 'mockup-dish', quantity: 5, dishName: "mockup", historicalUnitPriceInCents: 12},
              {dishId: 'mockup-dish', quantity: 2, dishName: "mockup", historicalUnitPriceInCents: 1},
            ]}
            onAcceptCardFromQueue={requests.updateRequestStatus}
            onDeclineRequest={handleDecline}
          />
        </div>

        {/*X Mockup*/}
        <div className="min-w-70 basis-70 flex-1 max-w-full">
          <TableRequestCard
            key={'123'}
            requestId = {'123'}
            userName = {'Mockup'}
            state = {'PAID'}
            checkpointTimestamp = {Date.now() + 5*60_000}
            relatedInfo = {[
              {nomination: 'ABC', value: "ABCDE"},
              {nomination: 'EFG', value: "HIGJK"},
              {nomination: 'Pago', value: String(centsToDecimal(12345))},
            ]}
            selectedOrder = {[
              {dishId: 'mockup-dish', quantity: 2, dishName: "Visteck a lo pobre con moyabamba", historicalUnitPriceInCents: 125},
              {dishId: 'mockup-dish', quantity: 5, dishName: "mockup", historicalUnitPriceInCents: 12},
              {dishId: 'mockup-dish', quantity: 2, dishName: "mockup", historicalUnitPriceInCents: 1},
            ]}
            onAcceptCardFromQueue={requests.updateRequestStatus}
            onDeclineRequest={handleDecline}
          />
        </div>

        {/*X Mockup*/}
        <div className="min-w-70 basis-70 flex-1 max-w-full">
          <TableRequestCard
            key={'123'}
            requestId = {'123'}
            userName = {'Mockup'}
            state = {'PAID'}
            checkpointTimestamp = {Date.now() + 5*60_000}
            relatedInfo = {[
              {nomination: 'ABC', value: "ABCDE"},
              {nomination: 'EFG', value: "HIGJK"},
              {nomination: 'Pago', value: String(centsToDecimal(12345))},
            ]}
            selectedOrder = {[
              {dishId: 'mockup-dish', quantity: 2, dishName: "Visteck a lo pobre con moyabamba", historicalUnitPriceInCents: 125},
              {dishId: 'mockup-dish', quantity: 5, dishName: "mockup", historicalUnitPriceInCents: 12},
              {dishId: 'mockup-dish', quantity: 2, dishName: "mockup", historicalUnitPriceInCents: 1},
            ]}
            onAcceptCardFromQueue={requests.updateRequestStatus}
            onDeclineRequest={handleDecline}
          />
        </div>
       
        {requests.currentState.map((tableRequest) => {

          const relatedInfo: CardInfoItem[] = [
            {nomination: 'Personas', value: String(tableRequest.groupSize)},
            {nomination: 'Llegaría en', value: String(tableRequest.arrivlaTime)}
          ] ///, {nomination: 'A', value: ''};
          
          return (
            <div key={tableRequest.requestId} className="min-w-70 basis-70 flex-1 max-w-full">
              <TableRequestCard
                requestId = {tableRequest.requestId}
                userName = {tableRequest.userName}
                state = {tableRequest.state}
                checkpointTimestamp = {tableRequest.onQueuedTimestamp}
                relatedInfo = {relatedInfo}
                onAcceptCardFromQueue={requests.updateRequestStatus}
                onDeclineRequest={handleDecline}
              />
            </div>
          );
        })}

        {orders.currentState.map((customerOrder) => {

          console.log(`🔎📃  Customer Order :\n ${JSON.stringify(customerOrder)}`)

          const relatedInfo: CardInfoItem[] = [
            {nomination: 'Personas', value: String(customerOrder.groupSize)},
            {nomination: 'Llegaría en', value: String(customerOrder.arrivalTimeInMinutes)},
            {nomination: 'Pago', value: String(centsToDecimal(customerOrder.totalCostInCents))}
          ] ///, {nomination: 'A', value: ''};

          const expectedArrivalTime = (customerOrder.arrivalTimeInMinutes*60_000) + customerOrder.onPaidTimeStamp;  // TODO: FIx the minutes difference here (It's giving an exrta minute when reload the page)
          
          return (
            <div key={customerOrder.requestId} className="min-w-70 basis-70 flex-1 max-w-full">
              <TableRequestCard
                requestId = {customerOrder.requestId}  //
                userName = {customerOrder.userName}
                state = {'PAID'}
                checkpointTimestamp = {expectedArrivalTime}
                relatedInfo = {relatedInfo}
                selectedOrder = {customerOrder.orderSelections}
                onAcceptCardFromQueue={requests.updateRequestStatus}
                onDeclineRequest={handleDecline}
              />
            </div>
          );
        })}

      </div>
    </div>
  );
};