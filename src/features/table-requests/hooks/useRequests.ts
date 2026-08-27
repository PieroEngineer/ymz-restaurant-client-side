import { MOCK_MENU_RESTAURANT_ID } from "@/features/menu/api/menuApi";
import { useCallback } from 'react';
import { toDomainOrder, toDomainTableRequest } from "@/features/table-requests/api/mappers/inboundMappers";
import { requestApi } from "@/features/table-requests/api/requestApi";
import { removeTableRequest, updateTableRequestState } from "@/features/table-requests/helpers/handleRequestUpdates";
import type { CancelRequestPayload, OrderPreselectionPayload, RequestUpdatePayload as UpdateRequestPayload, TableRequestPayload, UpdateInfoPayload, DenyRequestPayload } from "@/features/table-requests/types/api.types";
import type { TableRequest, TableRequestState } from "@/features/table-requests/types/domain.types";
import type { CancelRequestAttributes, UpdateStatusAttributes } from "@/features/table-requests/types/support/cardFields.types";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { Message } from "ably";

export const useRequests = () => {  // TODO: Some throwed errors aren't cached, cover them after tests
    const queryClient = useQueryClient();
    const queryKey = ['restaurant', MOCK_MENU_RESTAURANT_ID, 'active-requests'];

  // Initial load fetches currently open requests via Axios
    const { data: tableRequests } = useSuspenseQuery<TableRequest[]>({
      queryKey: queryKey,
      queryFn: requestApi.getAllRequests
    });

    const {mutate: denyRequestMutation/*, isPending*/} = useMutation({
      mutationFn: async ({ requestId }: CancelRequestAttributes) => {
        
        const currentTableRequests = queryClient.getQueryData<TableRequest[]>(['restaurant', MOCK_MENU_RESTAURANT_ID, 'active-requests']) 
        if(currentTableRequests === undefined){
          throw new Error("🔴Current table requests are undefined. Cannot update request status.");
        }
        const currentRequest = currentTableRequests.find((request) => request.requestId === requestId);

        if (!currentRequest) {
          throw new Error(`🔴Request with ID ${requestId} not found in current table requests.`);
        }

        const requestDenial: DenyRequestPayload = {
          userId: currentRequest.userId,
          restaurantId: MOCK_MENU_RESTAURANT_ID,
          actor: "RESTAURANT"
        }

        requestApi.denyRequest(requestDenial, requestId); /// Could the above code go in "onMutate"?
      },

      onMutate: async ({ requestId }: CancelRequestAttributes) => {
        await queryClient.cancelQueries({ queryKey: queryKey });

        const currentTableRequests = queryClient.getQueryData<TableRequest[]>(queryKey);
        if (currentTableRequests === undefined) {
          throw new Error("🔴Current table requests are undefined. Cannot update request status.");
        }
        const currentRequest = currentTableRequests.find((request) => request.requestId === requestId);
        const previousState = currentRequest?.state

        queryClient.setQueryData<TableRequest[]>(queryKey, (oldRequests) =>
          removeTableRequest(requestId, oldRequests)
        )

        return { previousState }
      },

      onError: (_err, _newRequestData, context) => {
        console.error('🔴  Critical database upload synchronization failure:', _err);
        if (context?.previousState) {
          queryClient.setQueryData(queryKey, context.previousState); // rollback on failure
          /// Consider include a invalidation of cache here // If we invalidate cache here, will it generate a loop of reattemps?
        }  
      }
    })

    const {mutate: updateRequestMutation/*, isPending*/} = useMutation({
    mutationFn: async ({ requestId, newState }: UpdateStatusAttributes) => {

      // TODO: Find get the request of the user from "currentTableRequests" and confirm if the transition if valid (e.g. Going from queued to accepted is valid)
      const currentTableRequests = queryClient.getQueryData<TableRequest[]>(['restaurant', MOCK_MENU_RESTAURANT_ID, 'active-requests']) 
      if(currentTableRequests === undefined){
        throw new Error("🔴Current table requests are undefined. Cannot update request status.");
      }
      const currentRequest = currentTableRequests.find((request) => request.requestId === requestId);

      if (!currentRequest) {
        throw new Error(`🔴Request with ID ${requestId} not found in current table requests.`);
      }

      const requestUpdate: UpdateRequestPayload = { /// Consider Don't use "Payload" our the API handler. So, this line should have a local entity
        userId: currentRequest.userId,
        requestId: requestId,
        newState: newState,
      }

      await requestApi.updateStatus(requestUpdate);
    },

    onMutate: async ({requestId, newState}) => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const currentTableRequests = queryClient.getQueryData<TableRequest[]>(queryKey);
      if (currentTableRequests === undefined) {
        throw new Error("🔴Current table requests are undefined. Cannot update request status.");
      }
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
        /// Consider include a invalidation of cache here // If we invalidate cache here, will it generate a loop of reattemps?
      }  
    },

    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: queryKey }); // reconcile with server truth either way
    // },
  })

    /**
     * High Performance Delta Updates:
     * Instead of refetching the whole list via Axios, we intercept the event 
     * and surgically mutate the TanStack Query array cache in real-time.
     */
    return {
      currentState: tableRequests,
      onRequestUpdated: useCallback((eventName: string, data: Message /*TODO: Incorrect type*/) => {queryClient.setQueryData<TableRequest[]>(
          queryKey,
          (oldRequests = []) => {
            switch (eventName) {
              case 'table-requested':
                const newRequestPayload = data as TableRequestPayload;
                const request = toDomainTableRequest(newRequestPayload)
                // Insert new request at the top of the list
                return [request, ...oldRequests];

              case 'request-status-updated': 
                // Update an existing ticket (e.g., ETA changed, or payment successful)
                const updateInfoPayload = data as UpdateInfoPayload;

                return updateTableRequestState(updateInfoPayload.requestId, updateInfoPayload.newStatus, oldRequests)

              case 'order-confirmed':
                const preselectedOrderPayload = data as OrderPreselectionPayload;
                const order = toDomainOrder(preselectedOrderPayload)
                return removeTableRequest(order.requestId, oldRequests)

              case 'request-canceled':
                const requestIdToRemove = data as CancelRequestPayload
                return removeTableRequest(requestIdToRemove.requestId, oldRequests)

              default:
                return oldRequests;
            }
          }
      )}, [queryClient]),

      updateRequestStatus: (requestId: string, newState: TableRequestState) => updateRequestMutation({requestId, newState}),

      denialRequest: (requestId: string) => denyRequestMutation({requestId})
    
    }
}