import { ConfigurationArea } from "@/features/profile/components/ConfigurationArea";
import { ConfirmationArea } from "@/features/profile/components/ConfirmationArea";
import { Videoicon } from "@/shared/components/icons/Videoicon";
import { LocationConfigurationModal } from "@/features/profile/components/LocationConfigurationModal";
import { useDataState } from "@/features/profile/hooks/useDataState";
import { useLocation } from "@/features/profile/hooks/useLocation";
import { useLocationModal } from "@/features/profile/hooks/useLocationModal";
import { useRestaurantInfo } from "@/features/profile/hooks/useRestaurantInfo";
import { NavigationPaths } from "@/shared/constants/navigation-names";
import { useAuthUser } from "@/shared/hooks/useAuthUser";
import { openInNewTab } from "@/shared/utils/webActors";
import { useNavigate } from "@tanstack/react-router";

export function RestaurantConfigPage() {
  const navigate = useNavigate(); // TODO: This go within the hooks, no here.

  const authUser = useAuthUser()

  const restaurantInfo = useRestaurantInfo(authUser.data?.userId)

  const dataState = useDataState(
    restaurantInfo.remote?? null,
    restaurantInfo.draft,
    restaurantInfo.downloadError,
    restaurantInfo.uploadError
  )

  const modalLocationModal = useLocationModal()
  const location = useLocation(restaurantInfo.onUpdateCoordinates, modalLocationModal.toggleOpening)

  console.log('🔎  Restaurant draft info', restaurantInfo.draft)

  return (
    <div className="h-screen w-screen bg-white overflow-hidden flex flex-col items-center">
      <header
        className="relative w-200 bg-brand-navy rounded-b-2xl shadow-lg flex items-center justify-center py-3 px-6 shrink-0"
      >
        <h1 className="text-white text-3xl font-semibold tracking-wide">
          Mi restaurante
        </h1>

        <button
          className="absolute right-0 top-0 h-full w-12 bg-white rounded-b-2xl flex items-center justify-center hover:scale-[1.1] cursor-pointer"
          onClick={() => openInNewTab('https://www.youtube.com/shorts/CcFNBwfFkHY')}  // TODO: Move to a hook  ///✏️
        >
          <Videoicon className='size-8'/>
        </button>
      </header>

      <main className="flex-1 w-full flex items-center justify-center gap-10 px-6 pb-1">
        {restaurantInfo.isDownloading || restaurantInfo.draft == null ? (
          <section
            className="bg-brand-navy text-white rounded-2xl shadow-lg flex flex-col items-center gap-4 px-10 py-8"
            role="status"
            aria-live="polite"
          >
            <div
              className="size-10 animate-spin rounded-full border-4 border-white/30 border-t-brand-primary"
              aria-hidden="true"
            />
            <span className="text-xl font-medium">Cargando información del restaurante...</span>
          </section>
        ) : (
          <>
            <ConfigurationArea // Consider pass update of the input error to remove it when the user starts to write
              restaurantName = {restaurantInfo.draft.restaurantName}
              phoneNumberToPay = {restaurantInfo.draft.peruvianPaymentNumber}
              phoneNumberToContact = {restaurantInfo.draft.peruvianContactNumber}
              qrUrl = {restaurantInfo.draft.qrUrl}
              logoUrl = {restaurantInfo.draft.logoUrl}
              dishesToShow = {restaurantInfo.draft.dishesToShowUrls}
              coordinates = {restaurantInfo.draft.coordinates}
              onUpdateStringField = {restaurantInfo.onUpdateTextField}
              onLocalImageImported = {restaurantInfo.onLocalImageImported}
              onOpenLocationModal = {modalLocationModal.toggleOpening}
            />
            <ConfirmationArea
              tryToSave = {() => {
                if(restaurantInfo.remote == null) return

                if(!dataState.validateInput()) return
                
                if(!restaurantInfo.remote.isInitialized){
                  restaurantInfo.initialize()

                  navigate({ to: NavigationPaths.Menu })
                }
                else{
                  restaurantInfo.update()
                }

              }}
              inputError={dataState.inputError}
              loadingStatus = {dataState.loadingState}
              isFirstTime = {!restaurantInfo.draft.isInitialized}
            />

            <LocationConfigurationModal
              isOpen = {modalLocationModal.isOpen}

              currentMethod = {modalLocationModal.selectionMethod}
              onSelectMethod = {modalLocationModal.selectMethod}
              onClose = {modalLocationModal.toggleOpening}

              isLoading = {location.isLoading}
              errorMessage = {location.error}
              onLocate = {(gmaps_link: string/*, coordinates: Coordinates*/) => {
                switch (modalLocationModal.selectionMethod){
                  case 'G_MAPS_LINK':
                    location.setViaGoogleLink(gmaps_link)
                    break;
                  case 'BROWSER':
                    location.setViaBrowser()
                    break;
                  // case 'MANUAL': // TODO
                  //   location.setManually(coordinates)
                  //   break;
                }
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}