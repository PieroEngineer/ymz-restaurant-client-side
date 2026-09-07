import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { HubPage } from '@/features/hub/pages/HubPage';
import { TableRequestsPage } from '@/features/table-requests/pages/TableRequestsPage';
import { SectionLayout } from '@/layouts/SectionLayout';
import { MenuManagerPage } from '@/features/menu/pages/MenuManagerPage';
import { AuthScreen } from '@/features/auth/pages/AuthPage';
import { RestaurantConfigPage } from '@/features/profile/pages/RestaurantProfileConfigPage';
import { NavigationPaths } from '@/shared/constants/navigation-names';

// Root Route: Acts as the absolute base container wrapper
const rootRoute = createRootRoute();

const AuthRoute = createRoute({ // TODO: Pass the route string to a type
  getParentRoute: () => rootRoute,
  path: NavigationPaths.Auth,
  component: AuthScreen,
});

// Index Route: Maps the root URL ("/") directly to your fullscreen HubPage
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: NavigationPaths.Hub,
  component: HubPage,
});

const profileInitializationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: NavigationPaths.RestaurantInitialization,
  component: RestaurantConfigPage,
});

// Dashboard Route: Maps the ("/dashboard") path and wraps its children inside your layout
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: NavigationPaths.RequestDashboard,
  component: () => (
    /* Configured layout context rule: hiding top-right logo parameter */
    <SectionLayout showLogo={false}> 
      <TableRequestsPage />
    </SectionLayout>
  ),
});

const restaurantProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
    path: NavigationPaths.RestaurantProfile,
  component: () => (
    /* Configured layout context rule: hiding top-right logo parameter */
    <SectionLayout showLogo={false}> 
      <RestaurantConfigPage/>
    </SectionLayout>
  ),
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: NavigationPaths.Menu,
  component: () => (
    <SectionLayout showLogo={false}>
      <MenuManagerPage />
    </SectionLayout>
  ),
});

// Create the unified router instance passing our route definitions
const routeTree = rootRoute.addChildren([AuthRoute, profileInitializationRoute, indexRoute, dashboardRoute, menuRoute, restaurantProfileRoute]);

export const router = createRouter({ routeTree });

// Register the router instance for maximum TypeScript autocomplete safety across the project
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}