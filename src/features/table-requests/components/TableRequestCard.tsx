import { DymamicTimer } from '@/features/table-requests/components/DymamicTimer';
import { DynamicCardArea } from '@/features/table-requests/components/dynamicCardArea';
import { InfoGrid } from '@/features/table-requests/components/InfoGrid';
import type { OrderItem, TableRequestState } from '@/features/table-requests/types/domain.types';
import type { CardInfoItem } from '@/features/table-requests/types/support/cardFields.types';

interface TableRequestCardProps {
  requestId: string;
  userName: string;
  state: TableRequestState;
  expectedArrivalTime: number;
  relatedInfo: CardInfoItem[];
  selectedOrder?: OrderItem[]; // TODO: Use "Omit" if not all attributes are used
  isTimesUp?: boolean; 
  onAcceptCardFromQueue?: (requestId: string, newState: TableRequestState) => void; // TODO: Remove the parameters from here, because there should be assigned previously (e.g. "onTryToObservePaymentUrl" and "onFinalizeOrder")
  onDeclineRequest?: (id: string) => void;
  onTryToObservePaymentUrl?: () => void;
  onFinalizeOrder?: () => void;
}

export function TableRequestCard({  // TODO: Divide this UI component in different UI components to have more flexibility for each case and don't have all the parameters and callbacks crowed
  requestId,
  userName,
  state,
  expectedArrivalTime,
  relatedInfo,
  selectedOrder,
  isTimesUp,
  onAcceptCardFromQueue,
  onDeclineRequest,
  onTryToObservePaymentUrl,
  onFinalizeOrder
}: TableRequestCardProps) {

  // Configuration map for future scaling
  const typeConfigs = {
    QUEUED: {
      label: 'En cola',
      colorBg: 'bg-[#ff3131]',
    },
    ACCEPTED: {
      colorBg: 'bg-[#ff3131]',
      label: 'En cola',
    },
    READY: {
      label: 'Aceptado',
      colorBg: 'bg-[#ff751f]',
    },
    PAY_TRIED: {
      label: 'Pagando',
      colorBg: 'bg-[#ff751f]',
    },
    PAID: {
      label: 'Pagado',
      colorBg: 'bg-[#00bf63]',
    }
  };

  const currentConfig = typeConfigs[state];

  console.log(`🔎🍖  Order selections (In Card):\n ${JSON.stringify(selectedOrder)}`)

  return (
    <article className="w-full scale-[0.9] md:scale-100 origin-top-left bg-white rounded-2xl shadow-yummizi border border-slate-100 flex flex-col overflow-hidden break-inside-avoid transition-all duration-200 hover:-translate-y-0.5">
      
      {/* SECTION 1: Main Text */}
      <header className="py-2 text-center">
        <h2 className="font-heading font-bold text-brand-navy text-xl lg:text-2xl tracking-wide">
          {userName}
        </h2>
      </header>

      {/* SECTION 2: Colored Stripe */}
      <div className={`${currentConfig.colorBg} w-full py-1.5 px-4 flex items-center justify-center text-white font-sans text-xs font-semibold tracking-wider uppercase`}>
        <span>{currentConfig.label}</span>
        <span className="mx-2 opacity-60">|</span>
        <DymamicTimer checkpointTimestamp={expectedArrivalTime} />
      </div>

      {/* SECTION 3: Information Space */}
      <InfoGrid
        items = {relatedInfo}
      />

      {/* ORANGE SEPARATOR LINE */}
      <div className="w-full px-4">
        <div className="w-full h-0.5 bg-brand-primary" />
      </div>

      {/* SECTION 4: Dynamic Space */}
      <footer className="p-2 flex flex-col items-center gap-3">
        <DynamicCardArea
          status = { state }
          selectedOrder =  { selectedOrder }
          onAcceptCardFromQueue = { () => onAcceptCardFromQueue?.(requestId, 'ACCEPTED') }  // TODO: This and the bellow function doesn't need the parameters here because they can be passed in the call of "TableRequestCard"
          onDeclineRequest = { () => onDeclineRequest?.(requestId) }  // TODO: It will be used once the websockets of the customer's client-side is in different screens
          onTryToObservePaymentUrl = {onTryToObservePaymentUrl}
          onFinalizeOrder = {onFinalizeOrder}
          isTimesUp = {isTimesUp} // TODO: It should be triggered by the re-render and for the countdown. The countdown is missing
        />
      </footer>
    </article>
  );
};