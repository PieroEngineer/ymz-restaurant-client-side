import { DymamicTimer } from '@/features/table-requests/components/DymamicTimer';
import { DynamicCardArea } from '@/features/table-requests/components/dynamicCardArea';
import { InfoGrid } from '@/features/table-requests/components/InfoGrid';
import type { OrderItem, TableRequestState } from '@/features/table-requests/types/domain.types';
import type { CardInfoItem } from '@/features/table-requests/types/support/cardFields.types';

interface TableRequestCardProps {
  //X requestData: TableRequest;
  requestId: string;
  userName: string;
  state: TableRequestState;
  checkpointTimestamp: number;
  relatedInfo: CardInfoItem[];
  selectedOrder?: OrderItem[]; // TODO: Use "Omit" if not all attributes are used
  onAcceptCardFromQueue?: (requestId: string, newState: TableRequestState) => void;
  onDeclineRequest?: (id: string) => void;
}

export function TableRequestCard({
  //X requestData, 
  requestId,
  userName,
  state,
  checkpointTimestamp,
  relatedInfo,
  selectedOrder,
  onAcceptCardFromQueue,
  onDeclineRequest
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
    <article className="w-full bg-white rounded-2xl shadow-yummizi border border-slate-100 flex flex-col overflow-hidden break-inside-avoid transition-all duration-200 hover:-translate-y-0.5">
      
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
        <DymamicTimer checkpointTimestamp={checkpointTimestamp} />
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
          onAcceptCardFromQueue = { () => onAcceptCardFromQueue?.(requestId, 'ACCEPTED') }
          onDeclineRequest = { () => onDeclineRequest?.(requestId) }
        />
      </footer>
    </article>
  );
};