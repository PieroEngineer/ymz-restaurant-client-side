import React, { useState } from 'react';
import { Menu, X, Home, UtensilsCrossed } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen w-screen bg-white text-brand-navy overflow-hidden relative">
      
      {/* 1. FIXED BRAND WATERMARK (Top-Right) */}
      <div className="global-brand-watermark pointer-events-none select-none">
        {/* Placeholder text for the logo. Later replace with your actual <img> or <svg> */}
        <span className="font-heading text-2xl font-bold text-brand-primary tracking-wider bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
          YUMMIZI
        </span>
      </div>

      {/* 2. DYNAMIC SIDEBAR LAYER */}
      <aside 
        className={`
          h-full bg-brand-navy text-white flex flex-col transition-all duration-300 ease-in-out z-30 shadow-yummizi
          ${isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'}
        `}
      >
        {/* Sidebar Header Content (Visible only when expanded) */}
        <div className="h-20 flex items-center px-6 border-b border-white/10 overflow-hidden shrink-0">
          {isSidebarOpen && (
            <span className="font-heading text-xl font-bold text-brand-primary tracking-wide whitespace-nowrap animate-fade-in">
              Partner Hub
            </span>
          )}
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {/* Main Link */}
          <button className={`w-full flex items-center gap-4 p-3 rounded-xl bg-brand-primary text-white font-medium transition-all group ${!isSidebarOpen ? 'justify-center' : ''}`}>
            <Home size={22} className="shrink-0" />
            {isSidebarOpen && <span className="animate-fade-in text-sm font-sans">Main</span>}
          </button>

          {/* Menu Link */}
          <button className={`w-full flex items-center gap-4 p-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white font-medium transition-all group ${!isSidebarOpen ? 'justify-center' : ''}`}>
            <UtensilsCrossed size={22} className="shrink-0 group-hover:text-brand-primary transition-colors" />
            {isSidebarOpen && <span className="animate-fade-in text-sm font-sans">Menu</span>}
          </button>
        </nav>
      </aside>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* FLOATING SIDEBAR TOGGLE BUTTON (Top-Left) */}
        <div className="absolute top-4 left-4 z-40">
          <button 
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl bg-white border border-brand-navy/10 text-brand-navy shadow-yummizi hover:shadow-yummizi-hover hover:scale-105 transition-all cursor-pointer flex items-center justify-center"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* FEATURE PAGE VIEWPORT CONTAINER */}
        <main className="flex-1 w-full h-full pt-20 px-6 pb-6 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}