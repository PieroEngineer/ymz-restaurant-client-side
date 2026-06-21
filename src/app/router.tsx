import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { HubPage } from '@/features/hub/pages/HubPage';
import { TableRequestsPage } from '@/features/table-requests/pages/TableRequestsPage';
import { SectionLayout } from '@/layouts/SectionLayout';
import { MenuManagerPage } from '@/features/menu/pages/MenuManagerPage';

// Root Route: Acts as the absolute base container wrapper
const rootRoute = createRootRoute();

// Index Route: Maps the root URL ("/") directly to your fullscreen HubPage
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HubPage,
});

// Dashboard Route: Maps the ("/dashboard") path and wraps its children inside your layout
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    /* Configured layout context rule: hiding top-right logo parameter */
    <SectionLayout showLogo={false}> 
      <TableRequestsPage />
    </SectionLayout>
  ),
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: () => (
    <SectionLayout showLogo={false}>
      <MenuManagerPage />
    </SectionLayout>
  ),
});

// Create the unified router instance passing our route definitions
const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute, menuRoute]);

export const router = createRouter({ routeTree });

// Register the router instance for maximum TypeScript autocomplete safety across the project
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}