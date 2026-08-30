import { useState } from 'react';

import { ChannelProvider } from 'ably/react';

// Import Feature Layers
import { RequestDashboard } from '@/features/table-requests/components/RequestDashboard';
import { ColoredExplorationIcon } from '@/features/table-requests/components/icons/ColoredExplorationIcon'; // TODO: It's possible to 
import { LightExplorationIcon } from '@/features/table-requests/components/icons/LightExplorationIcon';        // toggle the color by 
import { ColoredMgfGlassIcon } from '@/features/table-requests/components/icons/ColoredMgfGlassIcon';     // clicking, so only 2
import { LightMgfGlassIcon } from '@/features/table-requests/components/icons/LightMgfGlassIcon';            // images necessary here
import { DoorIcon } from '@/features/table-requests/components/icons/DoorIcon';
import { QueueIcon } from '@/features/table-requests/components/icons/QueueIcon';
import { CookingIcon } from '@/features/table-requests/components/icons/CookingIcon';
import { MOCK_MENU_RESTAURANT_ID } from '@/features/menu/api/menuApi';
import { PaymentViewModal } from '@/features/table-requests/components/PaymentViewModal';
import { usePaymentViewModal } from '@/features/table-requests/hooks/usePaymentViewModal';
import { useRequests } from '@/features/table-requests/hooks/useRequests';
import { useOrders } from '@/features/table-requests/hooks/useOrders';

type RequestDashboardScrollSection = 'queued' | 'ready' | 'paid';

type RequestDashboardScrollTarget = {
  section: RequestDashboardScrollSection;
  triggerKey: number;
};

export function TableRequestsPage() {
  // Local state to track the image alterations for the top-right widget block
  const [explorationMode, setExplorationMode] = useState(false);
  const [dashboardScrollTarget, setDashboardScrollTarget] = useState<RequestDashboardScrollTarget | null>(null);

  const channelName = `restaurant:${MOCK_MENU_RESTAURANT_ID}:ops`;

  const scrollDashboardTo = (section: RequestDashboardScrollSection) => { // TODO: Move it to a hook
    setDashboardScrollTarget({
      section,
      triggerKey: Date.now(),
    });
  };

  const paymentViewModal = usePaymentViewModal()
  const requests = useRequests();
  const orders = useOrders();
  const isLoading = requests.isPending || orders.isPending;

  console.log('🔎💸  Observed Payment URL:', paymentViewModal.observedPaymentUrl);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      
      {/* TOP-CENTER TITLE BANNER RECTANGLE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-brand-navy px-12 rounded-b-2xl flex items-center justify-center z-20 shadow-yummizi-blue">
        <h1 className="font-heading mx-30 my-1 font-bold text-white text-xl lg:text-5xl tracking-wide whitespace-nowrap">
          Solicitudes para mesa
        </h1>
      </div>

      {/* TOP-RIGHT COMPACT ALTERNATING IMAGE CONTROLLER */}
      <div className="absolute top-0 right-0 mt-2 mr-4 z-20">
        <div className="relative bg-white rounded-xl p-3 shadow-md flex items-center gap-4 border border-brand-navy/5">

          {/* Alternating Slot 2 */}
          <button 
            type="button"
            onClick={() => setExplorationMode(true)}
            className="size-15 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          >
            {explorationMode ? (
                <ColoredMgfGlassIcon className="size-15 text-brand-primary scale-105" />
            ) : (
                <LightMgfGlassIcon className="size-15 text-brand-primary scale-105" />
            )}
          </button>
          
          {/* Alternating Slot 1 */}
          <button 
            type="button"
            onClick={() => setExplorationMode(false)}
            className="size-15 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          >
            {explorationMode ? (
                <LightExplorationIcon className="size-15 text-brand-primary scale-105" />
            ) : (
                <ColoredExplorationIcon className="size-15 text-brand-primary scale-105" />
            )}
          </button>

          <div className="absolute inset-0 bg-black/60 rounded-xl backdrop-blur-[1px] flex items-center justify-center cursor-not-allowed select-none">
              <span className="text-white text-sm font-bold tracking-wider uppercase">
                  Próximamente
              </span>
          </div>

        </div>
      </div>

      {/* VERTICAL LEFT-SIDE STATUS RAIL*/}
      <div className="absolute top-20 left-0 w-20 bottom-0 py-4 flex flex-col items-center justify-center z-20">
        {/* Master Obround Shell Container */}
        <div className="w-18 h-full bg-white rounded-full shadow-yummizi border border-brand-navy/5 flex flex-col items-center justify-between py-8 px-2">
          
          {/* Sub-Obround 1: #ff3131 (High Priority / Urgent Alert Status) */}
          <button
            type="button"
            // aria-label="Ir a solicitudes en cola"
            onClick={() => scrollDashboardTo('queued')}
            className="w-14 h-[30%] bg-[#ff3131] rounded-full shadow-inner transition-transform hover:scale-105 active:scale-95 cursor-pointer grid place-items-center px-1"
          >
            <QueueIcon className = "w-full h-full"/>
          </button>
          
          {/* Sub-Obround 2: #ff751f (In Progress / Standard Active Flow) */}
          <button
            type="button"
            // aria-label="Ir a solicitudes pagadas"
            onClick={() => scrollDashboardTo('ready')}
            className="w-14 h-[30%] bg-brand-primary rounded-full shadow-inner transition-transform hover:scale-105 active:scale-95 cursor-pointer grid place-items-center px-1"
          >
            <DoorIcon className = "w-full h-full"/>
          </button>
          
          {/* Sub-Obround 3: #00bf63 (Ready / Fulfilled Status Tracker) */}
          <button
            type="button"
            // aria-label="Ir a solicitudes listas"
            onClick={() => scrollDashboardTo('paid')}
            className="w-14 h-[30%] bg-[#00bf63] rounded-full shadow-inner transition-transform hover:scale-105 active:scale-95 cursor-pointer grid place-items-center px-1"
          >
            <CookingIcon className = "w-full h-full"/>
          </button>

        </div>
      </div>

      {/* WORKSPACE GRID FRAME: RESERVED FOR INCOMING LIVE TABLE REQUESTS */}
      {/* Positioned cleanly below the header banners (pt-24) and to the right of the status rail (pl-24) */}
      <main className="w-full h-full pt-28 pl-24 pr-4 pb-2 overflow-hidden">
        <div className="w-full h-full border-2 border-dashed border-brand-navy/20 rounded-3xl bg-slate-50/50 flex flex-col items-center justify-center p-2 transition-colors duration-300">
          
          {/* Scalable Container Delivery */}

          {isLoading ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-5 text-center animate-fade-in">
              <div className="relative size-16" role="status" aria-label="Cargando solicitudes">
                <span className="absolute inset-0 rounded-full border-4 border-brand-primary/20" />
                <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-primary animate-spin" />
                <span className="absolute inset-1/3 rounded-full bg-brand-primary/15" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-brand-navy">Cargando solicitudes</h2>
                <p className="mt-1 font-sans text-sm text-brand-navy/50">Estamos preparando tu espacio de trabajo.</p>
              </div>
            </div>
          ) : (
            <ChannelProvider channelName={channelName}>
              <RequestDashboard
                requests={requests}
                orders={orders}
                scrollTarget={dashboardScrollTarget}
                onTryToObservePaymentUrl = { (url: string | null) => {
                  paymentViewModal.toggleOpening()
                  paymentViewModal.setObservedPaymentUrl(url)
                }}
              />
            </ChannelProvider>
          )}

        </div>
      </main>

      <PaymentViewModal
        isOpen = {paymentViewModal.isOpen}
        paymentImageUrl = {paymentViewModal.observedPaymentUrl}
        onClose = {paymentViewModal.toggleOpening}
        // onContactUser = {() => {}}
      />

    </div>
  );
}
