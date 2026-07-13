import { useChannel } from 'ably/react';
import { useQueryClient } from '@tanstack/react-query';
import type { TableRequestPayload } from '@/features/table-requests/types/index';
import { MOCK_MENU_RESTAURANT_ID } from '@/features/menu/api/menuApi';

export const useRestaurantLiveRequests = (restaurantId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['restaurant', restaurantId, 'active-requests'];

  const channelName = `restaurant:${MOCK_MENU_RESTAURANT_ID}:ops`;

  const { channel } = useChannel(channelName, (message) => {
    const { name, data } = message;
    const payload = data as TableRequestPayload;

    // ✅ 2. Use a comma here instead of template literal to view the full object details
    console.log("✉️ Real-time Ably Frame arrived:", message);
    console.log(`🏷️ Event action name matched: "${name}"`);

    /**
     * High Performance Delta Updates:
     * Instead of refetching the whole list via Axios, we intercept the event 
     * and surgically mutate the TanStack Query array cache in real-time.
     */
    queryClient.setQueryData<TableRequestPayload[]>(
      queryKey,

      (oldRequests = []) => {
        switch (name) {
          case 'table-requested':
            // Insert new request at the top of the list
            return [payload, ...oldRequests];

          case 'request-updated':
            // Update an existing ticket (e.g., ETA changed, or payment successful)
            return oldRequests.map((req) => 
              req.requestId === payload.requestId ? { ...req, ...payload } : req
            );

          case 'request-cleared':
            // Remove from view once seated
            return oldRequests.filter((req) => req.requestId !== payload.requestId);

          default:
            return oldRequests;
        }
      }
    );
  });

  // Action restaurant takes to accept/clear requests, broadcasting it back to the system
  const updateRequestStatus = async (requestId: string, nextStatus: 'preparing' | 'arrived') => {
    await channel.publish('restaurant-action', { requestId, nextStatus });
  };

  return { updateRequestStatus };
};