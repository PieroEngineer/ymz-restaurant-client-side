import { useState } from 'react';
import { ColoredExplorationIcon } from '@/features/requests/components/ColoredExplorationIcon'; // TODO: It's possible to 
import { LightExplorationIcon } from '@/features/requests/components/LightExplorationIcon';    // toggle the color by 
import { ColoredMgfGlassIcon } from '@/features/requests/components/ColoredMgfGlassIcon';     // clicking, so only 2
import { LightMgfGlassIcon } from '@/features/requests/components/LightMgfGlassIcon';        // images necessary here
import { DoorIcon } from '@/features/requests/components/DoorIcon';
import { QueueIcon } from '@/features/requests/components/QueueIcon';
import { CookingIcon } from '@/features/requests/components/CookingIcon';


export function TableRequestsPage() {
  // Local state to track the image alterations for the top-right widget block
  const [explorationMode, setExplorationMode] = useState(false);
//   const [toggleSlotB, setToggleSlotB] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      
      {/* 1. TOP-CENTER TITLE BANNER RECTANGLE */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 bg-brand-navy px-12 rounded-b-2xl flex items-center justify-center z-20 shadow-yummizi-blue"
      >
        <h1 className="font-heading mx-30 my-5 font-bold text-white text-2xl lg:text-5xl tracking-wide whitespace-nowrap">
          Solicitudes en cola
        </h1>
      </div>

      {/* 2. TOP-RIGHT COMPACT ALTERNATING IMAGE CONTROLLER */}
      <div className="absolute top-0 right-0 mt-2 mr-4 z-20">
        <div className="bg-white rounded-xl p-3 shadow-md flex items-center gap-4 border border-brand-navy/5">

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

        </div>
      </div>

      {/* 3. VERTICAL LEFT-SIDE STATUS RAIL*/}
      <div className="absolute top-20 left-0 w-20 bottom-0 py-4 flex flex-col items-center justify-center z-20">
        {/* Master Obround Shell Container */}
        <div className="w-18 h-full bg-white rounded-full shadow-yummizi border border-brand-navy/5 flex flex-col items-center justify-between py-8 px-2">
          
          {/* Sub-Obround 1: #ff3131 (High Priority / Urgent Alert Status) */}
          <div className="w-14 h-[30%] bg-[#ff3131] rounded-full shadow-inner transition-transform hover:scale-105 cursor-pointer grid place-items-center px-1">
            <QueueIcon className = "w-full h-full"/>
          </div>
          
          {/* Sub-Obround 2: #ff751f (In Progress / Standard Active Flow) */}
          <div className="w-14 h-[30%] bg-brand-primary rounded-full shadow-inner transition-transform hover:scale-105 cursor-pointer grid place-items-center px-1">
            <DoorIcon className = "w-full h-full"/>
          </div>
          
          {/* Sub-Obround 3: #00bf63 (Ready / Fulfilled Status Tracker) */}
          <div className="w-14 h-[30%] bg-[#00bf63] rounded-full shadow-inner transition-transform hover:scale-105 cursor-pointer grid place-items-center px-1">
            <CookingIcon className = "w-full h-full"/>
          </div>

        </div>
      </div>

      {/* 4. WORKSPACE GRID FRAME: RESERVED FOR INCOMING LIVE TABLE REQUESTS */}
      {/* Positioned cleanly below the header banners (pt-24) and to the right of the status rail (pl-24) */}
      <main className="w-full h-full pt-28 pl-24 pr-4 pb-4 overflow-hidden">
        <div className="w-full h-full border-2 border-dashed border-brand-navy/20 rounded-3xl bg-slate-50/50 flex flex-col items-center justify-center p-8 transition-colors duration-300">
          
          <div className="text-center max-w-sm animate-fade-in">
            {/* Real-time incoming indicator animation ring */}
            <div className="relative w-12 h-12 mx-auto mb-4">
              <span className="absolute inset-0 rounded-full bg-brand-primary/20 animate-ping" />
              <span className="relative w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-brand-primary" />
              </span>
            </div>
            
            <h3 className="font-heading font-bold text-brand-navy text-lg mb-1">
              Live Stream Workspace Active
            </h3>
            <p className="text-brand-navy/50 font-sans text-xs leading-relaxed">
              This structural viewport grid container frame is waiting to stream dynamic client order modules from LocalStack.
            </p>
          </div>

        </div>
      </main>

    </div>
  );
}