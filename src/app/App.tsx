import { DashboardLayout } from '@/layouts/DashboardLayout';

function App() {
  return (
    <DashboardLayout>
      {/* This area represents where your main pages will inject their features */}
      <div className="h-full w-full flex flex-col">
        <h1 className="text-3xl font-heading font-bold mb-2">Welcome Back, Chef!</h1>
        <p className="text-brand-navy/60 font-sans text-sm mb-6">
          Your dashboard is ready. Select an option from the sidebar or click a shortcut below to begin.
        </p>

        {/* Temporary layout frame test to verify fixed system rules */}
        <div className="flex-1 border-2 border-dashed border-brand-navy/20 rounded-2xl flex items-center justify-center bg-slate-50">
          <span className="text-brand-navy/40 font-accent text-sm">
            [Main Page Blueprint Viewport Container]
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default App;