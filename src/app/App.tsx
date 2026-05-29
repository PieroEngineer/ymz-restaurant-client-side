import { QueryProvider } from '@/app/providers/QueryProvider';
// import { DashboardLayout } from '@/layouts/DashboardLayout';
import { HubPage } from '@/features/hub/pages/HubPage';

function App() {
  return (
    <QueryProvider>
      {/* Mount the isolated landing hub directly */}
      <HubPage />
    </QueryProvider>
  );

  /// Now the Hub page is the first screen of the app
  // return (
  //   <QueryProvider>
  //     <DashboardLayout>
  //       <div className="h-full w-full flex flex-col">
  //         <h1 className="text-3xl font-heading font-bold mb-1 tracking-tight">
  //           Welcome Back, Chef!
  //         </h1>
  //         <p className="text-brand-navy/60 font-sans text-sm mb-6">
  //           LocalStack Gateway Connected • Real-time stream synchronized
  //         </p>

  //         {/* Core Feature Workspace Viewport */}
  //         <div className="flex-1 border border-brand-navy/10 rounded-2xl flex items-center justify-center bg-slate-50 shadow-inner">
  //           <span className="text-brand-navy/40 font-accent text-xs tracking-wide">
  //             [Main Restaurant Dashboard Area Ready for Development]
  //           </span>
  //         </div>
  //       </div>
  //     </DashboardLayout>
  //   </QueryProvider>
  // );
}

export default App;