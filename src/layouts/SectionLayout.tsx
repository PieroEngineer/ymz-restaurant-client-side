import React, { useState } from 'react';

import yummizilogo from '@/assets/images/yummizi-logo.webp'

interface SectionLayoutProps {
  children: React.ReactNode;
  showLogo?: boolean; // Dynamic parameter to toggle top-right logo visibility
}

export function SectionLayout({ children, showLogo = true }: SectionLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen w-screen bg-brand-background overflow-hidden relative font-sans">
      {/* 1. DYNAMIC WATERMARK LOGO CONTROL */}
      {showLogo && (
        <div className="absolute top-3 right-6 select-none z-40 animate-fade-in">
          <img 
            src={yummizilogo} 
            alt="Yummizi logo" 
            className="size-20 object-contain select-none transition-transform rounded-xl group-hover:scale-105 shadow-yummizi"
            />
        </div>
      )}

      {/* 2. SPEC-DRIVEN SIDEBAR LAYER */}
      <aside 
        className={`
          h-full bg-white text-brand-navy flex flex-col transition-all duration-300 ease-in-out z-30 border-r border-brand-navy/5 relative
          rounded-tr-3xl
          ${isSidebarOpen ? 'w-72' : 'w-0 border-r-0'}
        `}
      >
        {/* TOP INTERIOR GAP: Allocating space for the layout matching top-left button */}
        <div className="h-20 shrink-0" />

        {/* TOP GROUP: MAIN FEATURE OPTION BUTTONS */}
        <nav className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
          
          {/* Main Hub Option */}
          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-bold font-sans transition-all group duration-200 hover:shadow-yummizi cursor-pointer bg-white text-brand-navy">
            <img src="/vite.svg" alt="Main" className="w-6 h-6 object-contain" />
            <span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 whitespace-nowrap`}>
              Main Hub
            </span>
          </button>

          {/* Thin, non-touching separating divider line */}
          <div className="mx-4 my-2 border-t border-brand-navy/20 shrink-0" />

          {/* Menu Option */}
          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-bold font-sans transition-all group duration-200 hover:shadow-yummizi cursor-pointer bg-white text-brand-navy">
            <img src="/vite.svg" alt="Menu" className="w-6 h-6 object-contain" />
            <span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 whitespace-nowrap`}>
              Menu Management
            </span>
          </button>

          {/* Thin, non-touching separating divider line */}
          <div className="mx-4 my-2 border-t border-brand-navy/20 shrink-0" />

          {/* Table Requests Option */}
          <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-bold font-sans transition-all group duration-200 hover:shadow-yummizi cursor-pointer bg-white text-brand-navy">
            <img src="/vite.svg" alt="Requests" className="w-6 h-6 object-contain" />
            <span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 whitespace-nowrap`}>
              Table Requests
            </span>
          </button>

          {/* BOTTOM GROUP: ISOLATED, SMALLER OPTION LINK */}
          <div className="mt-auto pt-4 flex flex-col gap-2">
            <div className="mx-4 mb-2 border-t border-brand-navy/20 shrink-0" />
            
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold font-sans transition-all group duration-200 hover:shadow-yummizi cursor-pointer bg-white text-brand-navy/80">
              <img src="/vite.svg" alt="Settings" className="w-5 h-5 object-contain" />
              <span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 whitespace-nowrap`}>
                System Settings
              </span>
            </button>
          </div>
        </nav>
      </aside>

      {/* 3. CORE VIEWPORT MAIN COMPONENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* WORKSPACE DATA MOUNT SLOT */}
        <main className="flex-1 w-full h-full px-10 pb-10 overflow-hidden relative">
          {children}
        </main>
      </div>
      
      {/* ASYMMETRIC FLOATING TOGGLE BUTTON (Locks strictly to the extreme Top-Left layout boundary) */}
      <div className="absolute top-0 left-0 z-50">
          <button 
          onClick={toggleSidebar}
          className="w-16 h-16 flex items-center justify-center bg-brand-primary text-white shadow-yummizi transition-all duration-300 ease-in-out cursor-pointer rounded-br-2xl"
          style={{ borderRadius: '0px 0px 16px 0px' }} // Only bottom-right corner rounded
          aria-label="Toggle Navigation Control"
          >
          {/* Custom pure HTML/CSS 3-lines burger icon to easily execute the 90° rotation spec */}
          <div 
              className={`flex flex-col justify-between w-6 h-4 transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'rotate-90' : 'rotate-0'
              }`}
          >
              <span className="w-full h-0.5 bg-white rounded-full" />
              <span className="w-full h-0.5 bg-white rounded-full" />
              <span className="w-full h-0.5 bg-white rounded-full" />
          </div>
          </button>
      </div>

    </div>
  );
}