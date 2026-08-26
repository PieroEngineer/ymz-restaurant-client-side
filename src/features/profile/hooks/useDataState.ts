import { areRestaurantsEqual as areRestaurantsDataEqual } from "@/features/profile/helpers/restaurantComparators";
import { isValidPeruvianNumber } from "@/features/profile/helpers/phoneNumberValidators";
import type { Restaurant } from "@/features/profile/types/domain.types";
import type { DataState } from "@/features/profile/types/support/dataState.types";
import { useMemo, useState } from "react";


export function useDataState(
    remoteData: Restaurant | null,
    draftData: Restaurant | null,
    isDownloadError: boolean,
    isUploadError: boolean,
){
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const loadingState = useMemo((): DataState => {
        if(remoteData == null || draftData == null) return 'LOADING'

        if(isDownloadError || isUploadError) return 'ERROR'

        if(!areRestaurantsDataEqual(remoteData, draftData)) return 'EDITED'

        return 'SYNC'

    }, [remoteData, draftData])

    const validateInput = (): boolean => {
        if (draftData == null) {
            setErrorMessage("No se encontró la información del restaurante.")
            return false
        }

        if (draftData.restaurantName.trim().length < 2) {
            setErrorMessage("El nombre del restaurante debe tener al menos 2 caracteres.")
            return false
        }

        if(draftData.coordinates[0] === 0 && draftData.coordinates[1] === 0){   // TODO: Modify this to check if the coordinates are null instead of checking if they are 0,0
            setErrorMessage("Debes seleccionar la ubicación de tu restaurante.")
            return false
        }

        if (!isValidPeruvianNumber(draftData.peruvianContactNumber)) {
            setErrorMessage("El número de contacto no es válido.\nDebe tener el formato peruano")
            return false
        }

        if (!isValidPeruvianNumber(draftData.peruvianPaymentNumber)) {
            setErrorMessage("El número de pago no es válido.\nDebe tener el formato peruano")
            return false
        }

        if (draftData.qrUrl.trim() === "") {
            setErrorMessage("El QR es obligatoria.")
            return false
        }

        if (draftData.logoUrl.trim() === "") {
            setErrorMessage("El logo de su restaurante es obligatoria.")
            return false
        }

        if (!draftData.dishesToShowUrls.some((url) => url.trim() !== "")) {
            setErrorMessage("Debes agregar al menos un plato para mostrar.")
            return false
        }

        setErrorMessage(null)
        return true
    }

    return {
        loadingState: loadingState,
        validateInput: () => validateInput(),
        inputError: errorMessage
    }
}