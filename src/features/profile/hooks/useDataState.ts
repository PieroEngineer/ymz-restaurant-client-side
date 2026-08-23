import { areRestaurantsEqual as areRestaurantsDataEqual } from "@/features/profile/helpers/restaurantComparators";
import type { Restaurant } from "@/features/profile/types/domain.types";
import type { DataState } from "@/features/profile/types/support/dataState.types";
import { useMemo } from "react";


export function useDataState(
    remoteData: Restaurant | null,
    draftData: Restaurant | null,
    isDownloadError: boolean,
    isUploadError: boolean,
){
    const loadingState = useMemo((): DataState => {
        if(remoteData == null || draftData == null) return 'LOADING'

        if(isDownloadError || isUploadError) return 'ERROR'

        if(!areRestaurantsDataEqual(remoteData, draftData)) return 'EDITED'

        return 'SYNC'

    }, [remoteData, draftData])

    return {
        state: loadingState
    }
}