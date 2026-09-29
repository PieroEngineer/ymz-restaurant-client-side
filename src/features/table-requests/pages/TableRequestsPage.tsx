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
    <div className="relative flex h-full w-full flex-col overflow-hidden select-none">
      
      {/* TOP-CENTER TITLE BANNER RECTANGLE */}
      <header
        className="relative mx-auto w-full shrink-0 bg-brand-navy rounded-b-2xl shadow-lg flex items-center justify-center py-3 px-14 sm:px-16 lg:w-200 lg:px-6"
      >
        <h1 className="text-white text-2xl sm:text-3xl font-semibold tracking-wide text-center">
          Solicitudes para mesa
        </h1>

        <button
          className="absolute right-0 top-0 h-full w-12 bg-white rounded-b-2xl flex items-center justify-center hover:scale-[1.1] cursor-pointer"
          onClick={() => openInNewTab('https://youtu.be/fAfyB8eCOTE?si=tUD2BbaatAMSYTAQ&t=116')}  // TODO: Move to a hook
        >
          <Videoicon className='size-8'/>
        </button>
      </header>

      {/* TOP-RIGHT COMPACT ALTERNATING IMAGE CONTROLLER */}
      <div className="absolute top-14 right-2 z-30 hidden scale-75 origin-top-right sm:top-0 sm:right-0 sm:mt-2 sm:mr-4 sm:scale-100 md:block">
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
      <div className="relative z-20 flex h-14 w-full shrink-0 flex-row items-center justify-center py-0 md:absolute md:bottom-0 md:left-0 md:top-20 md:h-auto md:w-20 md:flex-col md:py-4">
        {/* Master Shell Container */}
        <div className="h-12 w-[90%] max-w-xs bg-white rounded-full shadow-yummizi border border-brand-navy/5 flex flex-row md:h-full md:w-18 md:max-w-none md:flex-col items-center justify-between px-3 py-1 md:py-8 md:px-2">
          
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
      <main className="w-full min-h-0 flex-1 overflow-hidden px-3 pt-3 pb-3 md:pl-24 md:pr-4 md:pt-15 md:pb-0">
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
