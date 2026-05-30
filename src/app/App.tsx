import { RouterProvider } from '@tanstack/react-router';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { router } from '@/app/router';

function App() {
  return (
    <QueryProvider>
      {/* Let TanStack Router handle the view injection automatically */}
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;