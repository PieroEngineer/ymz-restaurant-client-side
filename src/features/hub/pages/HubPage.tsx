import { useNavigate } from '@tanstack/react-router';
import { HubButton } from '@/features/hub/components/HubButton';

import analytics from '@/features/hub/assets/analytics.webp'
import deviceswithyummizi from '@/features/hub/assets/devices-with-yummizi.webp'
import menu from '@/features/hub/assets/menu.webp'
import mic from '@/features/hub/assets/mic.webp'
import options from '@/features/hub/assets/options.webp'
import restaurant from '@/features/hub/assets/restaurant.webp'
import trafficlight from '@/features/hub/assets/traffic-light.webp'
import yummizilogo from '@/assets/images/yummizi-logo.webp'

export function HubPage() {
  const navigate = useNavigate(); // TanStack navigation hook instance
  
  return (
    <div className="w-screen h-screen bg-brand-background relative flex flex-col items-center justify-center px-12 overflow-hidden">
      
      {/* 1. TOP-RIGHT BRANDING LOGO WATERMARK WITH SHADOW */}
      <div className="absolute top-6 right-6 select-none">  {/*TODO: Change its absolute position by a position that doesn't cross the button in small screens*/}
        <img 
          src={yummizilogo} 
          alt="Yummizi logo" 
          className="size-24 object-contain select-none transition-transform rounded-xl group-hover:scale-105"
        />
      </div>

      {/* 2. RESPONSIVE CONTAINER MATRIX (Locked safely inside viewport constraints) */}
      <div className="grid grid-cols-4 gap-8 w-full max-w-7xl h-dvh items-center">  {/*TODO: Convert into rows when the screen is vertical*/}
        
        {/* COLUMN 1: Explicitly distributed height segments */}
        <div className="flex flex-col h-3/4">
          {/* Header text occupies exactly 30% of the column height */}
          <div className="h-[30%] flex items-center pb-4">
            <span className="font-sans font-bold text-brand-navy tracking-wider text-lg md:text-4xl leading-none text-shadow-yummizi">  {/*Here there will be the restaurant logo instead of the name*/}
              Bienvenidos <br />Pollitos chiken
            </span>
          </div>
          {/* Button occupies the remaining 70% of the column height */}
          <div className="h-[70%]">
            <HubButton 
              label="Solicitudes de mesa" 
              imageSrc={trafficlight} 
              contentPadding="p-10" // Generous, easily controllable custom padding
              onClick={() => navigate({ to: '/dashboard' })}
            />
          </div>
        </div>

        {/* COLUMN 2: Stacked Buttons Container */}
        <div className="grid grid-rows-2 gap-8 h-3/4">
          <HubButton label="Mi Restaurante" imageSrc={restaurant} />
          <HubButton label="Mi Menú" imageSrc={menu} onClick={() => navigate({ to: '/menu' })}/>
        </div>

        {/* COLUMN 3: Stacked Buttons Container */}
        <div className="grid grid-rows-2 gap-8 h-3/4">
          <HubButton label="Mis Dispositivos" imageSrc={deviceswithyummizi} />
          <HubButton label="Mis Estadísticas" imageSrc={analytics} />
        </div>

        {/* COLUMN 4: Stacked Buttons Container */}
        <div className="grid grid-rows-2 gap-8 h-3/4">
          <HubButton label="Contáctanos" imageSrc={mic} />
          <HubButton label="Opciones" imageSrc={options} />
        </div>

      </div>
    </div>
  );
}