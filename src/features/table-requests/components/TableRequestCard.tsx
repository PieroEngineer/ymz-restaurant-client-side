import { DynamicCardArea } from '@/features/table-requests/components/dynamicCardArea';
import { InfoGrid } from '@/features/table-requests/components/InfoGrid';
import { Stopwatch } from '@/features/table-requests/components/Stopwatch';
import type { TableRequest, TableRequestState } from '@/features/table-requests/types/domain.types';
import type { CardInfoItem } from '@/features/table-requests/types/support/cardFields.types';

interface TableRequestCardProps {
  requestData: TableRequest;
  onAcceptCardFromQueue?: (requestId: string, newState: TableRequestState) => void;
  onDeclineRequest?: (id: string) => void;
}

export function TableRequestCard({
  requestData,
  onAcceptCardFromQueue,
  onDeclineRequest
}: TableRequestCardProps) {
  
  console.log(`🔎  A card received this data :\n ${JSON.stringify(requestData)}`)
  const { arrivlaTime, userName, groupSize,  onQueuedTimestamp,  state,  /*specifics,*/ requestId } = requestData;

  const commonInfo: CardInfoItem[]  = [{nomination: 'Personas', value: String(groupSize)}] //, {nomination: 'A', value: ''}]
  const commonPrePaidInfo: CardInfoItem[] = [...commonInfo, {nomination: 'Llegaría en', value: String(arrivlaTime)}]

  // Configuration map for future scaling
  const typeConfigs = {
    QUEUED: {
      label: 'En cola',
      colorBg: 'bg-[#ff3131]',
      relatedInfo: commonPrePaidInfo
    },
    ACCEPTED: {
      colorBg: 'bg-[#ff3131]',
      label: 'En cola',
      relatedInfo: commonPrePaidInfo
    },
    READY: {
      label: 'Aceptado',
      colorBg: 'bg-[#ff3131]',
      relatedInfo: [...commonPrePaidInfo, {nomination: 'Estado', value: 'En Menú'}]
    },
    PAID: {
      label: 'Pagado',
      colorBg: 'bg-[#00bf63]',
      relatedInfo: [...commonInfo, {nomination: '', value: ''}]
    }
  };

  const currentConfig = typeConfigs[state];

  return (
    <article className="w-full bg-white rounded-2xl shadow-yummizi border border-slate-100 flex flex-col overflow-hidden break-inside-avoid transition-all duration-200 hover:-translate-y-0.5">
      
      {/* SECTION 1: Main Text */}
      <header className="py-4 text-center">
        <h2 className="font-heading font-bold text-brand-navy text-xl lg:text-2xl tracking-wide">
          {userName}
        </h2>
      </header>

      {/* SECTION 2: Colored Stripe */}
      <div className={`${currentConfig.colorBg} w-full py-1.5 px-4 flex items-center justify-center text-white font-sans text-xs font-semibold tracking-wider uppercase`}>
        <span>{currentConfig.label}</span>
        <span className="mx-2 opacity-60">|</span>
        <Stopwatch onQueuedTimestamp={onQueuedTimestamp} />
      </div>

      {/* SECTION 3: Information Space */}
      <InfoGrid
        items = {currentConfig.relatedInfo}
      />

      {/* ORANGE SEPARATOR LINE */}
      <div className="w-full px-4">
        <div className="w-full h-0.5 bg-brand-primary" />
      </div>

      {/* SECTION 4: Dynamic Space */}
      <footer className="p-4 flex flex-col items-center gap-3">
        <DynamicCardArea
          status = {state}
          onAcceptCardFromQueue = {() => onAcceptCardFromQueue?.(requestId, 'ACCEPTED')}
          onDeclineRequest = {() => onDeclineRequest?.(requestId)}
        />
      </footer>
    </article>
  );
};



//{/* SECTION 3: Information Space */}
// <section className="p-4 flex flex-col gap-3 text-center">
//   {specifics.map((item, index) => (
//     <div key={index} className="w-full flex flex-col items-center">
//       <p className="font-sans text-sm text-brand-navy/80 font-medium">
//         <span className="text-brand-navy font-bold">*{item}*</span>
//       </p>
//       {/* Soft, thin horizontal line under each field */}
//       <div className="w-1/2 h-px bg-slate-100 mt-2" />
//     </div>
//   ))}
// </section>


// {/* <span className="font-sans text-xs font-semibold text-[#ff3131] animate-pulse mt-1">
//                 Esperando respuesta
//               </span> */}