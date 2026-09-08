import { toDomainOrder } from "@/features/table-requests/api/mappers/inboundMappers";
import { requestApi } from "@/features/table-requests/api/requestApi";
import { removeOrder } from "@/features/table-requests/helpers/handleRequestUpdates";
import type { FinalizeOrderPayload, OrderPreselectionPayload } from "@/features/table-requests/types/api.types";
import type { Order } from "@/features/table-requests/types/domain.types";
import type { OrderQueryKey } from "@/features/table-requests/types/query.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Message } from "ably";
import { useCallback } from "react";



export const useOrders = ( loggedRestaurantId: string | undefined ) => {
    const queryClient = useQueryClient();
    const queryKey: OrderQueryKey = ['restaurant', 'active-orders', { restaurantId: loggedRestaurantId }];  // TODO: consider remove the ID from here because there is only 1 restaurant in the session

    const { data: customerOrders, isPending } = useQuery/*<Order[]>*/({
        queryKey: queryKey,
        queryFn: requestApi.getAllOrders,
        enabled: !!loggedRestaurantId,
        staleTime: 0,
        refetchOnMount: 'always'
      }); 

    const finalizeOrderMutation = useMutation({
        mutationFn: async (orderId: string) => {
            if(loggedRestaurantId === undefined) {
                throw new Error("🔴Logged restaurant ID is undefined. Cannot deny request.");
            }

            const orderToFinalizePayload: FinalizeOrderPayload = {
                restaurantId: loggedRestaurantId,
                orderId: orderId
            } 

            await requestApi.finilizeOrder(orderToFinalizePayload)
        },
        
        onMutate: async (orderId: string) => {
            await queryClient.cancelQueries({ queryKey: queryKey })

            const previousOrders = queryClient.getQueryData<Order[]>(queryKey)

            queryClient.setQueryData<Order[]>( queryKey, (prevOrders) => 
                removeOrder(orderId, prevOrders)
            )

            return { previousOrders }
        },

        onError: (_error, _params, context) => {
            if (context?.previousOrders) {
                queryClient.setQueryData(queryKey, context.previousOrders);
            }
        }

    })
      
    /**
     * High Performance Delta Updates:
     * Instead of refetching the whole list via Axios, we intercept the event 
     * and surgically mutate the TanStack Query array cache in real-time.
     */
    return {
        currentState: customerOrders ?? [],
        isPending,

        finalizeOrder: (orderId: string) => finalizeOrderMutation.mutate(orderId),

        onOrderUpdate: useCallback((eventName: string, data: Message) => {queryClient.setQueryData<Order[]>(
            queryKey,
            (oldOrders = []) => {
                switch (eventName) {
                    case 'order-confirmed':
                        const preselectedOrderPayload = data as OrderPreselectionPayload;
                        const order = toDomainOrder(preselectedOrderPayload)
                        // Insert new order at the top of the list
                        console.log(`🔎  New order preselected :\n ${JSON.stringify(order)}`)
                        return [order, ...oldOrders];

                    default:
                        return oldOrders;
                }
            }
        )}, [queryClient])    
    }
}