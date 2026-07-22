import { MOCK_MENU_RESTAURANT_ID } from '@/features/menu/api/menuApi';
import type { RequestUpdatePayload, UpdatingRequestStatusResponse } from '@/features/table-requests/types/api.types';
import { axiosClient } from '@/shared/api/axiosClient';

export const requestApi = {

    async updateStatus(updateRequestPayload: RequestUpdatePayload): Promise<UpdatingRequestStatusResponse> {
    
        // Axios handles stringifying the JSON payload body automatically
        const response = await axiosClient.post<UpdatingRequestStatusResponse>(`requests/${MOCK_MENU_RESTAURANT_ID}/update`, updateRequestPayload);
    
        return response.data;
      }

}
