import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { HubPage } from '@/features/hub/pages/HubPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';

// 1. Root Route: Acts as the absolute base container wrapper
const rootRoute = createRootRoute();

// 2. Index Route: Maps the root URL ("/") directly to your fullscreen HubPage
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HubPage,
});

// 3. Dashboard Route: Maps the ("/dashboard") path and wraps its children inside your layout
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <DashboardLayout>
      <div className="h-full w-full flex flex-col">
        <h1 className="text-3xl font-heading font-bold mb-1 tracking-tight animate-fade-in">
          Table Requests Portal
        </h1>
        <p className="text-brand-navy/60 font-sans text-sm mb-6 animate-fade-in">
          Monitoring active diner arrival windows and order details
        </p>

        <div className="flex-1 border border-brand-navy/10 rounded-2xl flex items-center justify-center bg-slate-50 shadow-inner">
          <span className="text-brand-navy/40 font-accent text-xs tracking-wide">
            [Table Requests Interactive Workspace Content Area]
          </span>
        </div>
      </div>
    </DashboardLayout>
  ),
});

// Create the unified router instance passing our route definitions
const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute]);

export const router = createRouter({ routeTree });

// Register the router instance for maximum TypeScript autocomplete safety across the project
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}