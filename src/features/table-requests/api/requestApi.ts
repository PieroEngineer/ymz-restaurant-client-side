import { MOCK_MENU_RESTAURANT_ID } from '@/features/menu/api/menuApi';
import { toDomainOrder, toDomainTableRequest } from '@/features/table-requests/api/mappers/inboundMappers';
import type { OrderPreselectionPayload, RequestUpdatePayload as UpdateRequestPayload, TableRequestPayload, UpdatingRequestStatusResponse, DenyRequestPayload, FinalizeOrderPayload } from '@/features/table-requests/types/api.types';
import type { Order, TableRequest } from '@/features/table-requests/types/domain.types';
import { axiosClient } from '@/shared/api/axiosClient';

export const requestApi = {

    async updateStatus(updateRequestPayload: UpdateRequestPayload): Promise<UpdatingRequestStatusResponse> {
    
        // Axios handles stringifying the JSON payload body automatically
        const response = await axiosClient.post<UpdatingRequestStatusResponse>(`requests/${MOCK_MENU_RESTAURANT_ID}/update`, updateRequestPayload);
    
        return response.data;
    },


    
    async denyRequest(denyRequestPayload: DenyRequestPayload, requestId: string){
        await axiosClient.post(`requests/${requestId}/cancel`, denyRequestPayload)  // TODO: Later, it's going to use its own enpoint instead of the cancel one. // Unless the backend's route has double function
    },


    
    async getAllRequests(): Promise<TableRequest[]> {
        const response = await axiosClient.get<TableRequestPayload[]>(`requests/${MOCK_MENU_RESTAURANT_ID}`);
        console.log(`🔎  Raw request data :\n ${JSON.stringify(response.data)}`)
        return response.data.map(toDomainTableRequest);
    },


    
    async getAllOrders(): Promise<Order[]> {
        const response = await axiosClient.get<OrderPreselectionPayload[]>(`payments/${MOCK_MENU_RESTAURANT_ID}`);
        console.log(`🔎  Raw Order data :\n ${JSON.stringify(response.data)}`)
        return response.data.map(toDomainOrder);
    },


    
    async finilizeOrder(payload: FinalizeOrderPayload): Promise<void> {
        await axiosClient.post(`payments/finalize`, payload);
    }
};