import type { TableRequestState } from "@/features/table-requests/types/domain.types";

interface DynamicCardAreaProps{
    status: TableRequestState;
    onAcceptCardFromQueue?: () => void;
    onDeclineRequest?: () => void;
}

export function DynamicCardArea({status, onAcceptCardFromQueue, onDeclineRequest}: DynamicCardAreaProps) {
  switch (status) {
    case 'QUEUED':
      return (
        <div className="w-full grid grid-cols-2 gap-3">
            <button
            type="button"
            onClick={() => onDeclineRequest?.()}
            className="w-full py-2.5 rounded-xl border-2 border-[#ff3131] text-[#ff3131] font-sans text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors hover:bg-[#ff3131]/5 active:scale-98"
            >
            Decline
            </button>
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
      return <p></p>;
    default:
      return <p></p>;
  }
}