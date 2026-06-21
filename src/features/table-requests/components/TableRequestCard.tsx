import React from 'react';
import { type TableRequest } from '@/features/table-requests/types';

interface TableRequestCardProps {
  request: TableRequest;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

export const TableRequestCard: React.FC<TableRequestCardProps> = ({
  request,
  onAccept,
  onDecline
}) => {
  const { title, type, referenceTimeMinutes, info, statusText, id } = request;

  // Configuration map for future scaling (ACCEPTED, PAID additions)
  const typeConfigs = {
    QUEUED: {
      label: 'Queued',
      colorBg: 'bg-[#ff3131]',
    },
    ACCEPTED: {
      label: 'Accepted',
      colorBg: 'bg-brand-primary',
    },
    PAID: {
      label: 'Paid',
      colorBg: 'bg-[#00bf63]',
    }
  };

  const currentConfig = typeConfigs[type];

  return (
    <article className="w-full bg-white rounded-2xl shadow-yummizi border border-slate-100 flex flex-col overflow-hidden break-inside-avoid transition-all duration-200 hover:-translate-y-0.5">
      
      {/* SECTION 1: Main Text */}
      <header className="py-4 text-center">
        <h2 className="font-heading font-bold text-brand-navy text-xl lg:text-2xl tracking-wide">
          {title}
        </h2>
      </header>

      {/* SECTION 2: Colored Stripe */}
      <div className={`${currentConfig.colorBg} w-full py-1.5 px-4 flex items-center justify-center text-white font-sans text-xs font-semibold tracking-wider uppercase`}>
        <span>{currentConfig.label}</span>
        <span className="mx-2 opacity-60">|</span>
        <span>{referenceTimeMinutes} min</span>
      </div>

      {/* SECTION 3: Information Space */}
      <section className="p-4 flex flex-col gap-3 text-center">
        {info.map((item, index) => (
          <div key={index} className="w-full flex flex-col items-center">
            <p className="font-sans text-sm text-brand-navy/80 font-medium">
              {item.label} <span className="text-brand-navy font-bold">*{item.value}*</span>
            </p>
            {/* Soft, thin horizontal line under each field */}
            <div className="w-3/4 h-px bg-slate-100 mt-2" />
          </div>
        ))}
      </section>

      {/* ORANGE SEPARATOR LINE (#ff751f) */}
      <div className="w-full px-4">
        <div className="w-full h-0.5 bg-brand-primary" />
      </div>

      {/* SECTION 4: Dynamic Space */}
      <footer className="p-4 flex flex-col items-center gap-3">
        {type === 'QUEUED' && (
          <>
            <div className="w-full grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onDecline?.(id)}
                className="w-full py-2.5 rounded-xl border-2 border-[#ff3131] text-[#ff3131] font-sans text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors hover:bg-[#ff3131]/5 active:scale-98"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => onAccept?.(id)}
                className="w-full py-2.5 rounded-xl bg-[#00bf63] text-white font-sans text-xs font-bold uppercase tracking-wider cursor-pointer transition-shadow hover:shadow-lg active:scale-98"
              >
                Accept
              </button>
            </div>
            
            {statusText && (
              <span className="font-sans text-xs font-semibold text-[#ff3131] animate-pulse mt-1">
                {statusText}
              </span>
            )}
          </>
        )}
      </footer>
    </article>
  );
};