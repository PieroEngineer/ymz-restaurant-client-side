import { useEffect, useRef } from 'react';

import { TableRequestCard } from '@/features/table-requests/components/TableRequestCard';
import { useRealTimeDashboard } from '@/features/table-requests/hooks/useRealTimeDashboard';
import type { CardInfoItem } from '@/features/table-requests/types/support/cardFields.types';
import { centsToDecimal } from '@/shared/utils/moneyConversors';
import type { RequestDashboardScrollSection } from '@/features/table-requests/types/support/requestDashboard.types';
import type { Order, TableRequest, TableRequestState } from '@/features/table-requests/types/domain.types';
import type { Message } from 'ably';

type RequestDashboardScrollTarget = {
  section: RequestDashboardScrollSection;
  triggerKey: number;
};

type RequestDashboardProps = {
  scrollTarget?: RequestDashboardScrollTarget | null;
  onTryToObservePaymentUrl: (url: string | null) => void;
  requests: {
    currentState: TableRequest[];
    onRequestUpdated: (eventName: string, data: Message) => void;
    updateRequestStatus: (requestId: string, newState: TableRequestState) => void;
  };
  orders: {
    currentState: Order[];
    onOrderUpdate: (eventName: string, data: Message) => void;
    finalizeOrder: (orderId: string) => void;
  };
};

export function RequestDashboard({
  scrollTarget = null,
  onTryToObservePaymentUrl,
  requests,
  orders,
}: RequestDashboardProps) {

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const queuedRequestsRef = useRef<HTMLDivElement>(null);
  const readyRequestsRef = useRef<HTMLDivElement>(null);
  const paidRequestsRef = useRef<HTMLDivElement>(null);

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
          Escuchando las solicitudes de mesa en tiempo real
        </h3>
        <p className="text-brand-navy/50 font-sans text-xs leading-relaxed whitespace-pre-line">
          {'Tan pronto un cliente mande una solicitud, aparecerá aquí...\n(Recuerda inicializar tu perfil en "Mi restaurante" y "Mi Menú")'}
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
                  onAcceptCardFromQueue={requests.updateRequestStatus} // TODO: Necessary here?
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
                onAcceptCardFromQueue={requests.updateRequestStatus} // TODO: Necessary here?
                onDeclineRequest={handleDecline}
                onTryToObservePaymentUrl = { () => { onTryToObservePaymentUrl(customerOrder.paymentImageUrl) } }
                onFinalizeOrder = { () => { orders.finalizeOrder( customerOrder.requestId ) } }
                isTimesUp = {expectedArrivalTime < Date.now() ? true : false} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};