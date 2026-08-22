import { MOCK_MENU_RESTAURANT_ID } from "@/features/menu/api/menuApi";
import { toDomainRestaurant } from "@/features/profile/api/mappers/inboundMappers";
import type { GetRestaurantInfoResponse, UploadRestaurantInfoPayload, UploadRestaurantInfoResponse } from "@/features/profile/types/api.types";
import type { Restaurant } from "@/features/profile/types/domain.types";
import { axiosClient } from "@/shared/api/axiosClient";


export const profileApi = {

    async getRestaurantInfo( ): Promise<Restaurant>{
        
        const response = await axiosClient.get<GetRestaurantInfoResponse>(`restaurants/${MOCK_MENU_RESTAURANT_ID}/info`)

        return toDomainRestaurant(response.data);
    },

    async uploadRestaurantInfo(payload: UploadRestaurantInfoPayload): Promise<UploadRestaurantInfoResponse>{
        const response = await axiosClient.post<UploadRestaurantInfoResponse>(`restaurants/${MOCK_MENU_RESTAURANT_ID}/info`, payload)
        return response.data
    },

    /**
     * ☁️ HOP 2: Upload direct file binary to S3 using the newly generated pre-signed token URL
     */ // TODO: Consider to move it to the shared apis
    async uploadImageToS3(presignedUploadUrl: string, file: File): Promise<void> {  //TODO: handle it with fresh Axios clients ()

        const response = await fetch(presignedUploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type }, // Enforce exact content type matching for AWS Signature S3 validity
        body: file
        });

        if (!response.ok) {
        throw new Error(`🔴  Direct S3 binary allocation failed with status code: ${response.status}`);
        }
    }

}