import { RealtimeProvider } from '@/app/providers/AblyProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/app/router';
import { AuthInitProvider } from '@/app/providers/AuthInitProvider';

/*
----------------------------------------------------------------
Credits: Made by Piero Olivas Tuesta 😉
LinkedIn: /pieroengineerperu
Email: psot14022001@gmail.com
----------------------------------------------------------------
*/

function App() {
  return (
    <QueryProvider>
      <AuthInitProvider>
        <RealtimeProvider>
          {/* Let TanStack Router handle the view injection automatically */}
          <RouterProvider router={router} />
        </RealtimeProvider>
      </AuthInitProvider>
    </QueryProvider>
  );
}

export default App;