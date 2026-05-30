import { HubButton } from '@/features/hub/components/HubButton';

import analytics from '@/features/hub/assets/analytics.webp'
import deviceswithyummizi from '@/features/hub/assets/devices-with-yummizi.webp'
import menu from '@/features/hub/assets/menu.webp'
import mic from '@/features/hub/assets/mic.webp'
import options from '@/features/hub/assets/options.webp'
import restaurant from '@/features/hub/assets/restaurant.webp'
import trafficlight from '@/features/hub/assets/traffic-light.webp'

export function HubPage() {
  return (
    <div className="w-screen h-screen bg-brand-background relative flex items-center justify-center p-8">
      
      {/* 1. TOP-RIGHT BRANDING LOGO WATERMARK WITH SHADOW */}
      <div className="absolute top-6 right-6 select-none">
        <span className="font-accent text-2xl font-bold text-brand-primary tracking-wider bg-white px-4 py-2 rounded-xl shadow-yummizi border border-brand-navy/5">
          YUMMIZI
        </span>
      </div>

      {/* 2. CENTRALIZED 4-COLUMN TOUCHSCREEN MATRIX */}
      <div className="grid grid-cols-4 gap-8 max-w-6xl w-full aspect-[16/9] items-stretch">
        
        {/* COLUMN 1: Heading Label + Single Tall Button Slot */}
        <div className="flex flex-col gap-4 h-full">
          <span className="font-sans font-bold text-brand-navy tracking-wide text-sm px-1 shrink-0">
            Bienvenidos <br />Pollitos chiken
          </span>
          <div className="flex-1">
            <HubButton 
              label="Solicitudes activas" 
              imageSrc={trafficlight} // Placeholder asset path
              altText="Table management portal" 
            />
          </div>
        </div>

        {/* COLUMN 2: Stacked Buttons Container */}
        <div className="grid grid-rows-2 gap-8 h-full">
          <HubButton label="Mi Restaurante" imageSrc={restaurant} />
          <HubButton label="Mi Menú" imageSrc={menu} />
        </div>

        {/* COLUMN 3: Stacked Buttons Container */}
        <div className="grid grid-rows-2 gap-8 h-full">
          <HubButton label="Mis Dispositivos" imageSrc={deviceswithyummizi} />
          <HubButton label="Mis Estadísticas" imageSrc={analytics} />
        </div>

        {/* COLUMN 4: Stacked Buttons Container */}
        <div className="grid grid-rows-2 gap-8 h-full">
          <HubButton label="Contáctanos" imageSrc={mic} />
          <HubButton label="Opciones" imageSrc={options} />
        </div>

      </div>
    </div>
  );
}