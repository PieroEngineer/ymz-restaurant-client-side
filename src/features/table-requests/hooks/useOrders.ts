import { MOCK_MENU_RESTAURANT_ID } from "@/features/menu/api/menuApi";
import { toDomainOrder } from "@/features/table-requests/api/mappers/inboundMappers";
import type { OrderPreselectionPayload } from "@/features/table-requests/types/api.types";
import type { Order } from "@/features/table-requests/types/domain.types";
import { axiosClient } from "@/shared/api/axiosClient";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { Message } from "ably";
import { useCallback } from "react";



export const useOrders = () => {
    const queryClient = useQueryClient();
    const queryKey = ['restaurant', MOCK_MENU_RESTAURANT_ID, 'active-orders'];

    const { data: customerOrders } = useSuspenseQuery<Order[]>({  //  TODO: Move inside the hook "useOrders"
        queryKey: queryKey,
        queryFn: async () => {
          const response = await axiosClient.get<OrderPreselectionPayload[]>(`payments/${MOCK_MENU_RESTAURANT_ID}`);
          console.log(`🔎  Raw Order data :\n ${JSON.stringify(response.data)}`)
          return response.data.map(toDomainOrder);
        },
      }); 
      
    /**
     * High Performance Delta Updates:
     * Instead of refetching the whole list via Axios, we intercept the event 
     * and surgically mutate the TanStack Query array cache in real-time.
     */
    return {
        currentState: customerOrders,
        onOrderUpdate: useCallback((eventName: string, data: Message) => {queryClient.setQueryData<Order[]>(
            queryKey,
            (oldOrders = []) => {
                switch (eventName) {
                    case 'new-order-preselected':
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