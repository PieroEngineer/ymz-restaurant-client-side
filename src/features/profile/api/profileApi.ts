import { toDomainRestaurant } from "@/features/profile/api/mappers/inboundMappers";
import type { GetRestaurantInfoResponse, UpdateRestaurantInfoPayload, UploadRestaurantInfoResponse, InitializeRestaurantInfoPayload } from "@/features/profile/types/api.types";
import type { Restaurant } from "@/features/profile/types/domain.types";
import type { RestaurantQueryKey } from "@/features/profile/types/query.types";
import { axiosClient } from "@/shared/api/axiosClient";
import type { QueryFunctionContext } from "@tanstack/react-query";



export const profileApi = {

    async getRestaurantInfo({ queryKey }: QueryFunctionContext<RestaurantQueryKey> ): Promise<Restaurant>{
        const [, , { restaurantId }] = queryKey;
        
        if (restaurantId === undefined) {
            throw new Error("🔴 Undefined restaurant ID provided in query key.");
        }

        const response = await axiosClient.get<GetRestaurantInfoResponse>(`restaurants/${restaurantId}/info`)

        return toDomainRestaurant(response.data);
    },

    async updateRestaurantInfo(payload: UpdateRestaurantInfoPayload, restaurantId: string): Promise<UploadRestaurantInfoResponse>{
        const response = await axiosClient.post<UploadRestaurantInfoResponse>(`restaurants/${restaurantId}/info/update`, payload)
        return response.data
    },

    async initializeRestaurantInfo(payload: InitializeRestaurantInfoPayload, restaurantId: string): Promise<UploadRestaurantInfoResponse>{
        const response = await axiosClient.post<UploadRestaurantInfoResponse>(`restaurants/${restaurantId}/info/initialize`, payload)
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