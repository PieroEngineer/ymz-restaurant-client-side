import { useChannel } from 'ably/react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { TableRequestPayload, RequestUpdatePayload, UpdateInfoPayload, OrderPreselectionPayload } from '@/features/table-requests/types/api.types';
import { MOCK_MENU_RESTAURANT_ID } from '@/features/menu/api/menuApi';
import { toDomainTableRequest } from '@/features/table-requests/api/mappers/inboundMappers';
import type { TableRequest, TableRequestState } from '@/features/table-requests/types/domain.types';
import type { UpdateStatusAttributes } from '@/features/table-requests/types/support/cardFields.types';
import { requestApi } from '@/features/table-requests/api/requestApi';
import { updateTableRequestState } from '@/features/table-requests/helpers/handleRequestUpdates';

/**
 * @deprecated 
 */
export const useRestaurantLiveOrders = (restaurantId: string, currentTableRequests: TableRequest[]) => {
  const queryClient = useQueryClient();
  const queryKey = ['restaurant', restaurantId, 'active-requests'];

  const channelName = `restaurant:${MOCK_MENU_RESTAURANT_ID}:ops`;

  const { channel } = useChannel(channelName, (message) => {
    const { name, data } = message;
    

    // ✅ 2. Use a comma here instead of template literal to view the full object details
    console.log("✉️ Real-time Ably Frame arrived:", message);
    console.log(`🏷️ Event action name matched: "${name}"`);

    /**
     * High Performance Delta Updates:
     * Instead of refetching the whole list via Axios, we intercept the event 
     * and surgically mutate the TanStack Query array cache in real-time.
     */
    queryClient.setQueryData<TableRequest[]>(   // TODO: Find the way to put the above code in a function because it's equal to the code used in "useRestaurantLiveRequests" 
      queryKey,

      (oldRequests = []) => {
        switch (name) {
            
          case 'order-preselected': // (AI checkpoint)
            const preselectedOrderPayload = data as OrderPreselectionPayload;
            //...

          default:
            return oldRequests;
        }
      }
    );
  });

  const {mutate, isPending} = useMutation({
    mutationFn: async ({requestId, newState}: UpdateStatusAttributes) => {

      // TODO: Find get the request of the user from "currentTableRequests" and confirm if the transition if valid (e.g. Going from queued to accepted is valid)
      const currentRequest = currentTableRequests.find((request) => request.requestId === requestId);

      if (!currentRequest) {
        throw new Error(`Request with ID ${requestId} not found in current table requests.`);
      }

      const requestUpdate: RequestUpdatePayload = { /// Consider Don't use "Payload" our the API handler. So, this line should have a local entity
        userId: currentRequest.userId,
        requestId: requestId,
        newState: newState,
      }

      await requestApi.updateStatus(requestUpdate);
    },

    onMutate: async ({requestId, newState}) => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const currentRequest = currentTableRequests.find((request) => request.requestId === requestId);
      const previousState = currentRequest?.state

      queryClient.setQueryData<TableRequest[]>(queryKey, (oldRequests) =>
        updateTableRequestState(requestId, newState, oldRequests)
      );

      return { previousState };
    },

    onError: (_err, _newRequestData, context) => {
      console.error('🔴  Critical database upload synchronization failure:', _err);
      if (context?.previousState) {
        queryClient.setQueryData(queryKey, context.previousState); // rollback on failure
        /// Consider include a invalidation of cache here
      }  
    },

    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: queryKey }); // reconcile with server truth either way
    // },
  })

  return { 
    updateRequestStatus: (requestId: string, newState: TableRequestState) => mutate({requestId, newState})
  };
};