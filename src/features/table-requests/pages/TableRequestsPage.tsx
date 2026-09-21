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
import { PaymentViewModal } from '@/features/table-requests/components/PaymentViewModal';
import { usePaymentViewModal } from '@/features/table-requests/hooks/usePaymentViewModal';
import { useRequests } from '@/features/table-requests/hooks/useRequests';
import { useOrders } from '@/features/table-requests/hooks/useOrders';
import { useAuthUser } from '@/shared/hooks/useAuthUser';
import Videoicon from '@/shared/components/icons/Videoicon';
import { openInNewTab } from '@/shared/utils/webActors';

type RequestDashboardScrollSection = 'queued' | 'ready' | 'paid'; // TODO: Move to types

type RequestDashboardScrollTarget = {
  section: RequestDashboardScrollSection;
  triggerKey: number;
};

export function TableRequestsPage() {
  // Local state to track the image alterations for the top-right widget block
  const [explorationMode, setExplorationMode] = useState(false);
  const [dashboardScrollTarget, setDashboardScrollTarget] = useState<RequestDashboardScrollTarget | null>(null);


  const scrollDashboardTo = (section: RequestDashboardScrollSection) => { // TODO: Move it to a hook
    setDashboardScrollTarget({
      section,
      triggerKey: Date.now(),
    });
  };

  const authUser = useAuthUser()

  const channelName = `restaurant:${authUser.data?.userId}:ops`;

  const paymentViewModal = usePaymentViewModal()
  const requests = useRequests(authUser.data?.userId);
  const orders = useOrders(authUser.data?.userId);
  const isLoading = requests.isPending || orders.isPending;

  console.log('🔎💸  Observed Payment URL:', paymentViewModal.observedPaymentUrl);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      
      {/* TOP-CENTER TITLE BANNER RECTANGLE */}
      <div className="relative top-0 w-[92%] sm:w-[80%] max-w-2xl left-1/2 -translate-x-1/2 bg-brand-navy px-4 sm:px-8 md:px-12 rounded-b-2xl flex items-center justify-center z-20 shadow-yummizi-blue">
        <h1 className="font-heading mx-auto sm:mx-10 md:mx-30 my-1 font-bold text-white text-base sm:text-xl lg:text-5xl tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
          Solicitudes para mesa
        </h1>

        <button
          className="absolute right-0 top-0 h-full w-10 sm:w-12 bg-white rounded-b-2xl flex items-center justify-center hover:scale-[1.1] cursor-pointer shrink-0"
          onClick={() => openInNewTab('https://youtu.be/fAfyB8eCOTE?si=tUD2BbaatAMSYTAQ&t=116')}  // TODO: Move to a hook
        >
          <Videoicon className='size-6 sm:size-8'/>
        </button>
      </div>

      {/* TOP-RIGHT COMPACT ALTERNATING IMAGE CONTROLLER */}
      <div className="absolute top-14 right-2 sm:top-0 sm:right-0 sm:mt-2 sm:mr-4 z-30 scale-75 sm:scale-100 origin-top-right">
        <div className="relative bg-white rounded-xl p-3 shadow-md flex items-center gap-4 border border-brand-navy/5">

          {/* Alternating Slot 2 */}
          <button 
            type="button"
            onClick={() => setExplorationMode(true)}
            className="size-12 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          >
            {explorationMode ? (
                <ColoredMgfGlassIcon className="size-12 text-brand-primary scale-105" />
            ) : (
                <LightMgfGlassIcon className="size-12 text-brand-primary scale-105" />
            )}
          </button>
          
          {/* Alternating Slot 1 */}
          <button 
            type="button"
            onClick={() => setExplorationMode(false)}
            className="size-12 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          >
            {explorationMode ? (
                <LightExplorationIcon className="size-12 text-brand-primary scale-105" />
            ) : (
                <ColoredExplorationIcon className="size-12 text-brand-primary scale-105" />
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
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 h-14 w-[90%] max-w-xs top-auto md:top-20 md:left-0 md:w-20 md:h-auto md:bottom-0 md:translate-x-0 py-0 md:py-4 flex flex-row md:flex-col items-center justify-center z-20">
        {/* Master Shell Container */}
        <div className="w-full h-12 md:w-18 md:h-full bg-white rounded-full shadow-yummizi border border-brand-navy/5 flex flex-row md:flex-col items-center justify-between px-3 py-1 md:py-8 md:px-2">
          
          {/* Sub-Obround 1 */}
          <button
            type="button"
            // aria-label="Ir a solicitudes en cola"
            onClick={() => scrollDashboardTo('queued')}
            className="w-[30%] h-9 md:w-14 md:h-[30%] bg-[#ff3131] rounded-full shadow-inner transition-transform hover:scale-105 active:scale-95 cursor-pointer grid place-items-center px-1"
          >
            <QueueIcon className="w-full h-full max-h-6 md:max-h-none"/>
          </button>
          
          {/* Sub-Obround 2 */}
          <button
            type="button"
            // aria-label="Ir a solicitudes pagadas"
            onClick={() => scrollDashboardTo('ready')}
            className="w-[30%] h-9 md:w-14 md:h-[30%] bg-brand-primary rounded-full shadow-inner transition-transform hover:scale-105 active:scale-95 cursor-pointer grid place-items-center px-1"
          >
            <DoorIcon className="w-full h-full max-h-6 md:max-h-none"/>
          </button>
          
          {/* Sub-Obround 3 */}
          <button
            type="button"
            // aria-label="Ir a solicitudes listas"
            onClick={() => scrollDashboardTo('paid')}
            className="w-[30%] h-9 md:w-14 md:h-[30%] bg-[#00bf63] rounded-full shadow-inner transition-transform hover:scale-105 active:scale-95 cursor-pointer grid place-items-center px-1"
          >
            <CookingIcon className="w-full h-full max-h-6 md:max-h-none"/>
          </button>

        </div>
      </div>

      {/* WORKSPACE GRID FRAME: RESERVED FOR INCOMING LIVE TABLE REQUESTS */}
      {/* Positioned cleanly below the header banners (pt-15) and to the right of the status rail (pl-24) */}
      <main className="w-full h-full pt-32 md:pt-15 pl-3 md:pl-24 pr-3 md:pr-4 pb-20 md:pb-2 overflow-hidden">
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
                realTimeChannelName={channelName}
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
