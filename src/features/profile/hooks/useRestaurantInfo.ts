import { toRemoteRestaurantInitialization, toRemoteRestaurantUpdate } from "@/features/profile/api/mappers/outboundMappers";
import { profileApi } from "@/features/profile/api/profileApi";
import type { Restaurant } from "@/features/profile/types/domain.types";
import type { RestaurantResourceTypes } from "@/features/profile/types/support/imageManage.types";
import type { RestaurantStringRegularFields } from "@/features/profile/types/support/restaurantReduced.types";
import { convertToWebP } from "@/shared/utils/imageConversors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";


export function useRestaurantInfo(
){  // TODO: Consider to divide this hook between "Just fetch/upload data" and "just handle draft"
  const queryClient = useQueryClient();

  const restaurantQueryKey = ['restaurant', 'information'];

  const [draftRestaurantInfo, setDraftRestaurantInfo] = useState<Restaurant | null>(null)
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

  const updateMutation = useMutation({
    mutationFn: async () => {
      console.log('⬆️  Trying to upload restaurant info')

      const snapshot = queryClient.getQueryData<Restaurant>(restaurantQueryKey) ?? null

      if(snapshot == null) return
      if(draftRestaurantInfo == null) return

      const logoWasModified = snapshot.logoUrl != draftRestaurantInfo.logoUrl

      const dishImagesWereModified: [boolean, boolean, boolean] = [
        snapshot.dishesToShowUrls[0] != draftRestaurantInfo.dishesToShowUrls[0],
        snapshot.dishesToShowUrls[1] != draftRestaurantInfo.dishesToShowUrls[1],
        snapshot.dishesToShowUrls[2] != draftRestaurantInfo.dishesToShowUrls[2]
      ]

      const qrWasModified = snapshot.qrUrl != draftRestaurantInfo.qrUrl

      const payload = toRemoteRestaurantUpdate(draftRestaurantInfo, logoWasModified, dishImagesWereModified, qrWasModified)

      console.log('⬆️  Payload to send', JSON.stringify(payload))

      const responseWithPresignedUrls = await profileApi.updateRestaurantInfo(payload)
      
      console.log('⬆️  Restaurant info uploaded successfully', JSON.stringify(responseWithPresignedUrls))

      const imageUploads: Promise<void>[] = []

      if (responseWithPresignedUrls.logoPresignedUrl && draftRestaurantInfo.logoFile) {
        imageUploads.push(
          profileApi.uploadImageToS3(
            responseWithPresignedUrls.logoPresignedUrl.replaceAll('172.18.0.2', 'localhost'), // FIXME: Remove this replacement from all the urls
            draftRestaurantInfo.logoFile
          )
        )
      }

      if (responseWithPresignedUrls.paymentQrPresignedUrl && draftRestaurantInfo.qrFile) {
        imageUploads.push(
          profileApi.uploadImageToS3(
            responseWithPresignedUrls.paymentQrPresignedUrl.replaceAll('172.18.0.2', 'localhost'),
            draftRestaurantInfo.qrFile
          )
        )
      }

      responseWithPresignedUrls.dishesToShowPresignedUrls.forEach((presignedUrl, index) => {
        const dishFile = draftRestaurantInfo.dishesToShowFiles[index]

        if (presignedUrl && dishFile) {
          imageUploads.push(
            profileApi.uploadImageToS3(
              presignedUrl.replaceAll('172.18.0.2', 'localhost'),
              dishFile
            )
          )
        }
      })

      await Promise.all(imageUploads) // TODO: Consider that there is a special logic later to make the data and image uploads as a transaction. (Perhaps this logic is only in the backend) 

      queryClient.setQueryData(restaurantQueryKey, draftRestaurantInfo)
      console.log('✅  All images uploaded successfully')
      
    },
    onError: (error) => {
      console.error('❌  Error uploading restaurant info:', error);
    }

  })

  const initializeMutation = useMutation({
    mutationFn: async () => {
      console.log('⬆️  Trying to upload restaurant info')
      
      const snapshot = queryClient.getQueryData<Restaurant>(restaurantQueryKey) ?? null

      if(snapshot == null) return
      if(draftRestaurantInfo == null) return

      const dishImagesWereModified: [boolean, boolean, boolean] = [
        snapshot.dishesToShowUrls[0] != draftRestaurantInfo.dishesToShowUrls[0],
        snapshot.dishesToShowUrls[1] != draftRestaurantInfo.dishesToShowUrls[1],
        snapshot.dishesToShowUrls[2] != draftRestaurantInfo.dishesToShowUrls[2]
      ]

      const payload = toRemoteRestaurantInitialization(draftRestaurantInfo, dishImagesWereModified)

      console.log('⬆️  Payload to send', JSON.stringify(payload))

      const responseWithPresignedUrls = await profileApi.initializeRestaurantInfo(payload)

      console.log('⬆️  Restaurant info uploaded successfully', JSON.stringify(responseWithPresignedUrls))

      const imageUploads: Promise<void>[] = []

      if (responseWithPresignedUrls.logoPresignedUrl && draftRestaurantInfo.logoFile) {
        imageUploads.push(
          profileApi.uploadImageToS3(
            responseWithPresignedUrls.logoPresignedUrl.replaceAll('172.18.0.2', 'localhost'), // FIXME: Remove this replacement from all the urls
            draftRestaurantInfo.logoFile
          )
        )
      }

      if (responseWithPresignedUrls.paymentQrPresignedUrl && draftRestaurantInfo.qrFile) {
        imageUploads.push(
          profileApi.uploadImageToS3(
            responseWithPresignedUrls.paymentQrPresignedUrl.replaceAll('172.18.0.2', 'localhost'),
            draftRestaurantInfo.qrFile
          )
        )
      }

      responseWithPresignedUrls.dishesToShowPresignedUrls.forEach((presignedUrl, index) => {
        const dishFile = draftRestaurantInfo.dishesToShowFiles[index]

        if (presignedUrl && dishFile) {
          imageUploads.push(
            profileApi.uploadImageToS3(
              presignedUrl.replaceAll('172.18.0.2', 'localhost'),
              dishFile
            )
          )
        }
      })

      await Promise.all(imageUploads) // TODO: Consider that there is a special logic later to make the data and image uploads as a transaction. (Perhaps this logic is only in the backend) 

      queryClient.setQueryData(restaurantQueryKey, draftRestaurantInfo)
      console.log('✅  All images uploaded successfully')
    }
  })


  const onLocalImageImported = async (event: React.ChangeEvent<HTMLInputElement>, selectedImage: RestaurantResourceTypes | null) => { // TODO: Move it to a new hook which cares of the local images
    if (!selectedImage) return;
    if(draftRestaurantInfo == null) return

    const { files } = event.target;
    if (!files || files.length === 0) return;

    const targetFile = files[0];
    const webpTargetFile = await convertToWebP(targetFile)
    const associatedUrl = URL.createObjectURL(webpTargetFile)

    switch (selectedImage) {
      case "QR":
        setDraftRestaurantInfo({
          ...draftRestaurantInfo,
          qrUrl: associatedUrl,
          qrFile: webpTargetFile
        })
        break;

      case "LOGO":
        setDraftRestaurantInfo({
          ...draftRestaurantInfo,
          logoUrl: associatedUrl,
          logoFile: webpTargetFile
        })
        break;

      case 'FRONT1':
        setDraftRestaurantInfo({
          ...draftRestaurantInfo,
          dishesToShowUrls: [associatedUrl, draftRestaurantInfo.dishesToShowUrls[1], draftRestaurantInfo.dishesToShowUrls[2]],
          dishesToShowFiles: [webpTargetFile, draftRestaurantInfo.dishesToShowFiles[1], draftRestaurantInfo.dishesToShowFiles[2]]
        })
        break;

      case 'FRONT2':
        setDraftRestaurantInfo({
          ...draftRestaurantInfo,
          dishesToShowUrls: [draftRestaurantInfo.dishesToShowUrls[0], associatedUrl, draftRestaurantInfo.dishesToShowUrls[2]],
          dishesToShowFiles: [draftRestaurantInfo.dishesToShowFiles[0], webpTargetFile, draftRestaurantInfo.dishesToShowFiles[2]]
        })
        break;

      case 'FRONT3':
        setDraftRestaurantInfo({
          ...draftRestaurantInfo,
          dishesToShowUrls: [draftRestaurantInfo.dishesToShowUrls[0], draftRestaurantInfo.dishesToShowUrls[1], associatedUrl],
          dishesToShowFiles: [draftRestaurantInfo.dishesToShowFiles[0], draftRestaurantInfo.dishesToShowFiles[1], webpTargetFile]
        })
        break;

      default:
        break;
    }

    event.target.value = '';
  }

  return {
    
    draft: draftRestaurantInfo,

    remote: remoteQuery.data,
    
    isDownloading: remoteQuery.isLoading,
    
    isUploading: updateMutation.isPending || initializeMutation.isPending,
    
    downloadError: remoteQuery.isError,

    uploadError: updateMutation.isError || initializeMutation.isError,
    
    update: () => updateMutation.mutate(),

    initialize:() => initializeMutation.mutate(),

    onUpdateTextField: (fieldName: keyof RestaurantStringRegularFields, newValue: string) => {
      if(draftRestaurantInfo == null) return
      
      setDraftRestaurantInfo({
        ...draftRestaurantInfo,
        [fieldName]: newValue
      })
    },

    onUpdateDemostrationImageUrl: (position: 0 | 1 | 2, newImageUrl: string) => {
      if(draftRestaurantInfo == null) return
      
      const newDishesToShow = [...draftRestaurantInfo.dishesToShowUrls] as [string, string, string]
      newDishesToShow[position] = newImageUrl
      setDraftRestaurantInfo({
        ...draftRestaurantInfo,
        dishesToShowUrls: newDishesToShow
      })
    },

    onUpdateCoordinates: (newCoordinates: [number, number]) => {
      if(draftRestaurantInfo == null) return

      setDraftRestaurantInfo({
        ...draftRestaurantInfo,
        coordinates: newCoordinates
      })
    },

    onUpdateDishImage: (dishIndex: 0 | 1 | 2, newImageUrl: string) => {
      if(draftRestaurantInfo == null) return

      const newDishesToShow = [...draftRestaurantInfo.dishesToShowUrls] as [string, string, string]
      newDishesToShow[dishIndex] = newImageUrl
      setDraftRestaurantInfo({
        ...draftRestaurantInfo,
        dishesToShowUrls: newDishesToShow
      })
    },

    onLocalImageImported: onLocalImageImported,

  }
}