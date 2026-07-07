import { RealtimeProvider } from '@/app/providers/AblyProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/app/router';

function App() {
  return (
    <QueryProvider>
      <RealtimeProvider>
        {/* Let TanStack Router handle the view injection automatically */}
        <RouterProvider router={router} />
      </RealtimeProvider>
    </QueryProvider>
  );
}

export default App;