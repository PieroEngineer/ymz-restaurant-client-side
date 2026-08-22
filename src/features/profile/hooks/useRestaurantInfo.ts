import { toRemoteRestaurant } from "@/features/profile/api/mappers/outboundMappers";
import { profileApi } from "@/features/profile/api/profileApi";
import type { Restaurant } from "@/features/profile/types/domain.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";


export function useRestaurantInfo(){
  const queryClient = useQueryClient();

  const restaurantQueryKey = ['restaurant', 'information'];

  const [draftRestaurantInfo, setDraftRestaurantInfo] = useState<Restaurant>({
    restaurantId: '',
    restaurantName: '',
    logoUrl: '',
    coordinates: [0, 0],
    dishesToShow: ['', '', ''],
    peruvianPaymentNumber: '',
    peruvianContactNumber: '',
    qrUrl: ''
  })
  const hasInitializedDraft = useRef(false);

  const remoteQuery = useQuery({
    queryKey: restaurantQueryKey,
    queryFn: profileApi.getRestaurantInfo
  });

  useEffect(() => { 
    if (remoteQuery.data !== undefined && !hasInitializedDraft.current) {
      setDraftRestaurantInfo(remoteQuery.data);
      hasInitializedDraft.current = true; // seed only once — subsequent refetches won't touch the draft
    }
  }, [remoteQuery.data]);


  const remoteMutation = useMutation({
    mutationFn: async () => {
      console.log('⬆️  Trying to upload restaurant info')

      const snapshot = queryClient.getQueryData<Restaurant>(restaurantQueryKey) ?? null

      if(snapshot == null) return

      const logoWasModified = snapshot.logoUrl != draftRestaurantInfo.logoUrl

      const dishImagesWereModified: [boolean, boolean, boolean] = [
        snapshot.dishesToShow[0] != draftRestaurantInfo.dishesToShow[0],
        snapshot.dishesToShow[1] != draftRestaurantInfo.dishesToShow[1],
        snapshot.dishesToShow[2] != draftRestaurantInfo.dishesToShow[2]
      ]

      const qrWasModified = snapshot.qrUrl != draftRestaurantInfo.qrUrl

      const payload = toRemoteRestaurant(draftRestaurantInfo, logoWasModified, dishImagesWereModified, qrWasModified)

      const responseWithPresignedUrls = profileApi.uploadRestaurantInfo(payload)
      
      console.log('⬆️  Restaurant info uploaded successfully', JSON.stringify(responseWithPresignedUrls))
      // TODO: Check if the presigned arrives completly 
      // await Promise.all( ///✏️ Continue the uploading of images  // Remember for local ".replaceAll('172.18.0.2', 'localhost')"

      // )
                
    }
  })

  return {
    
    draft: draftRestaurantInfo,
    
    isDownloading: remoteQuery.isLoading,
    
    isUploading: remoteMutation.isPending,
    
    downloadError: remoteQuery.isError,
    
    upload: () => remoteMutation.mutate(),

    onUpdateTextField: (fieldName: keyof Omit<Restaurant, "dishesToShow" | "coordinates">, newValue: string) => {
      
      setDraftRestaurantInfo({
        ...draftRestaurantInfo,
        [fieldName]: newValue
      })
    },

    onUpdateDemostrationImageUrl: (position: 0 | 1 | 2, newImageUrl: string) => {
      
      const newDishesToShow = [...draftRestaurantInfo.dishesToShow] as [string, string, string]
      newDishesToShow[position] = newImageUrl
      setDraftRestaurantInfo({
        ...draftRestaurantInfo,
        dishesToShow: newDishesToShow
      })
    },

    onUpdateCoordinates: (newCoordinates: [number, number]) => {
      setDraftRestaurantInfo({
        ...draftRestaurantInfo,
        coordinates: newCoordinates
      })
    },

    onUpdateDishImage: (dishIndex: 0 | 1 | 2, newImageUrl: string) => {
      if(draftRestaurantInfo == null) return
      const newDishesToShow = [...draftRestaurantInfo.dishesToShow] as [string, string, string]
      newDishesToShow[dishIndex] = newImageUrl
      setDraftRestaurantInfo({
        ...draftRestaurantInfo,
        dishesToShow: newDishesToShow
      })
    }


  }
}