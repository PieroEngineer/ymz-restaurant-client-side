import { OrderSummaryTable } from "@/features/table-requests/components/inlineTable";
import type { OrderItem, TableRequestState } from "@/features/table-requests/types/domain.types";

interface DynamicCardAreaProps{
  status: TableRequestState;
  selectedOrder?: OrderItem[];
  onAcceptCardFromQueue?: () => void;
  onDeclineRequest?: () => void;
  onTryToObserveDetails?: () => void;
  onFinalizeOrder?: () => void;
  isTimesUp?: boolean;
}

export function DynamicCardArea({
  status,
  selectedOrder = [],
  onAcceptCardFromQueue,
  /*onDeclineRequest TODO*/
  onTryToObserveDetails,
  onFinalizeOrder,
  isTimesUp
}: DynamicCardAreaProps) {
  
  switch (status) {
    
    case 'QUEUED':
      return (
        <div className="w-full grid grid-cols-2">
            {/* <button
            type="button"
            onClick={() => onDeclineRequest?.()}
            className="w-full py-2.5 rounded-xl border-2 border-[#ff3131] text-[#ff3131] font-sans text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors hover:bg-[#ff3131]/5 active:scale-98"
            >
            Decline
            </button> */}
            <button
            type="button"
            onClick={() => onAcceptCardFromQueue?.()}
            className="w-full py-2.5 rounded-xl bg-[#00bf63] text-white font-sans text-xs font-bold uppercase tracking-wider cursor-pointer transition-shadow hover:shadow-lg active:scale-98"
            >
            Accept
            </button>
        </div>
    )
    
    case 'ACCEPTED':
      return (
      <span className="font-sans text-xs font-semibold text-[#ff3131] animate-pulse mt-1">
        Esperando respuesta
      </span>
      )
    
      case 'READY':
        return <p></p>;
    
      case 'PAID':
      // return OrderSummaryTable({items: selectedOrder})
      {/*
        Column
          Summary Table
          Button to try to observe payment url (onTryToObservePaymentUrl)
        */}
        return (
          <div className="w-full flex flex-col gap-2">
            <OrderSummaryTable items={selectedOrder} />

            <div
              className="flex items-center gap-1"
            >
              {isTimesUp===true && (
                <button
                  type="button"
                  onClick={() => onFinalizeOrder?.()}
                  className="w-full py-2.5 rounded-xl bg-brand-primary text-white font-sans text-xs font-bold uppercase tracking-wider cursor-pointer transition-shadow hover:shadow-lg active:scale-98"
                >
                  Finalizar
                </button>
              )}
              <button
                type="button"
                onClick={() => onTryToObserveDetails?.()}
                className="w-full py-2.5 rounded-xl bg-brand-navy text-white font-sans text-xs font-bold uppercase tracking-wider cursor-pointer transition-shadow hover:shadow-lg active:scale-98"
              >
                Ver detalles
              </button>
            </div>
          </div>
        );

    default:
      return <p></p>;
  }
}