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
import { openInNewTab } from '@/shared/utils/webActors';
import { NavigationPaths } from '@/shared/constants/navigation-names';

export function HubPage() {
  const navigate = useNavigate(); // TanStack navigation hook instance

  return (
    <div className="w-full min-h-dvh bg-brand-background relative flex flex-col items-center justify-start md:justify-center px-4 sm:px-8 md:px-12 py-6 md:py-0 overflow-y-auto">
      
      {/* 1. TOP-RIGHT BRANDING LOGO WATERMARK WITH SHADOW */}
      <div className="absolute top-6 right-6 select-none z-10">  {/*TODO: Change its absolute position by a position that doesn't cross the button in small screens*/}
        <img 
          src={yummizilogo} 
          alt="Yummizi logo" 
          className="size-24 object-contain select-none transition-transform rounded-xl group-hover:scale-105"
        />
      </div>

      {/* 2. RESPONSIVE CONTAINER MATRIX (Locked safely inside viewport constraints) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full max-w-7xl min-h-dvh md:h-dvh items-center pt-12 md:pt-0">  {/*TODO: Convert into rows when the screen is vertical*/}
        
        {/* COLUMN 1: Explicitly distributed height segments */}
        <div className="flex flex-col h-auto md:h-3/4 gap-4 md:gap-0">
          {/* Header text */}
          <div className="h-auto md:h-[30%] flex items-center justify-center md:justify-start text-center md:text-left pb-2 md:pb-4">
            <span className="font-sans font-bold text-brand-navy tracking-wider text-2xl sm:text-3xl md:text-4xl leading-snug text-shadow-yummizi">
              ¡Yummizi<br className="hidden md:inline" /> les da la<br className="hidden md:inline" /> Bienvenida!
            </span>
          </div>
          {/* Button container */}
          <div className="h-full md:h-[70%]">
            <HubButton 
              label="Solicitudes de mesa" 
              imageSrc={trafficlight} 
              contentPadding="p-4 sm:p-8 md:p-10"
              onClick={() => navigate({ to: NavigationPaths.RequestDashboard })}
            />
          </div>
        </div>

        {/* COLUMN 2: Stacked Buttons Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4 md:gap-8 h-auto md:h-3/4">
          <HubButton label="Mi Restaurante" imageSrc={restaurant} onClick={() => navigate({ to: NavigationPaths.RestaurantProfile })}/>
          <HubButton label="Mi Menú" imageSrc={menu} onClick={() => navigate({ to: NavigationPaths.Menu })}/>
        </div>

        {/* COLUMN 3: Stacked Buttons Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4 md:gap-8 h-auto md:h-3/4">
          <HubButton label="Mis Dispositivos" comingSoonCover = {true} imageSrc={deviceswithyummizi} />
          <HubButton label="Mis Estadísticas" comingSoonCover = {true} imageSrc={analytics} />
        </div>

        {/* COLUMN 4: Stacked Buttons Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4 md:gap-8 h-auto md:h-3/4">
          <HubButton label="Contáctanos" imageSrc={mic} onClick={() => openInNewTab('https://docs.google.com/forms/d/e/1FAIpQLSfvCrR8RdXhEWsrMl2j-spT3l0KmByA9kGqSrFRifHGRiU5Yg/viewform?usp=dialog')}/>
          <HubButton label="Opciones" comingSoonCover = {true} imageSrc={options} />
        </div>

      </div>
    </div>
  );
}