import { useEffect, useRef } from 'react';

import { TableRequestCard } from '@/features/table-requests/components/TableRequestCard';
import { useRequests } from '@/features/table-requests/hooks/useRequests';
import { useOrders } from '@/features/table-requests/hooks/useOrders';
import { useRealTimeDashboard } from '@/features/table-requests/hooks/useRealTimeDashboard';
import type { CardInfoItem } from '@/features/table-requests/types/support/cardFields.types';
import { centsToDecimal } from '@/shared/utils/moneyConversors';
import type { RequestDashboardScrollSection } from '@/features/table-requests/types/support/requestDashboard.types';

type RequestDashboardScrollTarget = {
  section: RequestDashboardScrollSection;
  triggerKey: number;
};

type RequestDashboardProps = {
  scrollTarget?: RequestDashboardScrollTarget | null;
};

export function RequestDashboard({ scrollTarget = null }: RequestDashboardProps) {
  // TODO: Analyze if the above double GET request can be unified

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const queuedRequestsRef = useRef<HTMLDivElement>(null);
  const readyRequestsRef = useRef<HTMLDivElement>(null);
  const paidRequestsRef = useRef<HTMLDivElement>(null);

  const requests = useRequests();
  const orders = useOrders();
  
  // Mount the real-time WebSocket listener dedicated to the restaurant operations channel
  useRealTimeDashboard(requests.onRequestUpdated, orders.onOrderUpdate)

  const handleDecline = (id: string) => {
    console.log(`Declined request: ${id}`); // TODO
  };

  useEffect(() => {
    if (!scrollTarget) return;

    const sectionRefs = {
      queued: queuedRequestsRef,
      ready: readyRequestsRef,
      paid: paidRequestsRef,
    };

    const scrollContainer = scrollContainerRef.current;
    const targetBlock = sectionRefs[scrollTarget.section].current;

    if (!scrollContainer || !targetBlock) return;

    const scrollContainerBox = scrollContainer.getBoundingClientRect();
    const targetBlockBox = targetBlock.getBoundingClientRect();

    scrollContainer.scrollTo({
      top: targetBlockBox.top - scrollContainerBox.top + scrollContainer.scrollTop,
      behavior: 'smooth',
    });
  }, [scrollTarget]);

  if (requests.currentState.length === 0 && orders.currentState.length === 0) {
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
    <div ref={scrollContainerRef} className="w-full h-full flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">

      {/* QUEUED REQUESTS BLOCK*/}
      <div ref={queuedRequestsRef} className="flex flex-wrap items-start gap-4 scroll-mt-2">
        {requests.currentState.map((tableRequest) => {

          if(tableRequest.state === 'QUEUED' || tableRequest.state === 'ACCEPTED') {
            const relatedInfo: CardInfoItem[] = [
              {nomination: 'Personas', value: String(tableRequest.groupSize)},
              {nomination: 'Tiempo plan.', value: String(tableRequest.arrivlaTime)}
            ] ///, {nomination: 'A', value: ''};
            
            return (
              <div key={tableRequest.requestId} className="w-72 shrink-0">
                <TableRequestCard
                  requestId = {tableRequest.requestId}
                  userName = {tableRequest.userName}
                  state = {tableRequest.state}
                  expectedArrivalTime = {tableRequest.onQueuedTimestamp}
                  relatedInfo = {relatedInfo}
                  onAcceptCardFromQueue={requests.updateRequestStatus}
                  onDeclineRequest={handleDecline}
                />
              </div>
            );
          }
        })}
      </div>

      {/* READY REQUESTS BLOCK*/}
      <div ref={readyRequestsRef} className="flex flex-wrap items-start gap-4 scroll-mt-2">
        {requests.currentState.map((tableRequest) => {

          if(tableRequest.state === 'READY' || tableRequest.state === 'PAY_TRIED') {
            const relatedInfo: CardInfoItem[] = [
              {nomination: 'Personas', value: String(tableRequest.groupSize)},
              {nomination: 'Tiempo plan.', value: String(tableRequest.arrivlaTime)},
              {nomination: 'Estado', value: tableRequest.state === 'READY' ? 'Seleccionando' : 'En pago'}
            ] ///, {nomination: 'A', value: ''};
            
            return (
              <div key={tableRequest.requestId} className="w-72 shrink-0">
                <TableRequestCard
                  requestId = {tableRequest.requestId}
                  userName = {tableRequest.userName}
                  state = {tableRequest.state}
                  expectedArrivalTime = {tableRequest.onQueuedTimestamp}
                  relatedInfo = {relatedInfo}
                  onAcceptCardFromQueue={requests.updateRequestStatus}
                  onDeclineRequest={handleDecline}
                />
              </div>
            );
          }
        })}
      </div>

      {/* PAID REQUESTS BLOCK*/}
      <div ref={paidRequestsRef} className="flex flex-wrap items-start gap-4 scroll-mt-2">
        {orders.currentState.map((customerOrder) => {

          console.log(`🔎📃  Customer Order :\n ${JSON.stringify(customerOrder)}`)

          const relatedInfo: CardInfoItem[] = [
            {nomination: 'Personas', value: String(customerOrder.groupSize)},
            {nomination: 'Tiempo plan.', value: String(customerOrder.arrivalTimeInMinutes)},
            {nomination: 'Pago', value: String(centsToDecimal(customerOrder.totalCostInCents))}
          ] ///, {nomination: 'A', value: ''};

          const expectedArrivalTime = (customerOrder.arrivalTimeInMinutes*60_000) + customerOrder.onPaidTimeStamp;  // TODO: minutes difference here (Check if it's giving an extra minute when reload the page)
          
          return (
            <div key={customerOrder.requestId} className="w-72 shrink-0">
              <TableRequestCard
                requestId = {customerOrder.requestId}  //
                userName = {customerOrder.userName}
                state = {'PAID'}
                expectedArrivalTime = {expectedArrivalTime}
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