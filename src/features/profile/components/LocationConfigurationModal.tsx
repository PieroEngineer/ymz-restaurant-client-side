import Pinicon from "@/features/profile/components/icons/PinIcon";
import type { CoordinatesSelectionMethodToken } from "@/features/profile/types/support/coordinates.type";
import { useRef } from "react";

interface LocationConfigurationModalProps {
    isOpen: boolean,

    currentMethod: CoordinatesSelectionMethodToken,
    onSelectMethod: (selectionMethod: CoordinatesSelectionMethodToken) => void,
    onClose: () => void,

    isLoading: boolean,
    errorMessage: string | null,
    onLocate: (gmaps_link: string/* TODO, coordinates: Coordinates*/) => void,
}

export function LocationConfigurationModal({
    isOpen,
    currentMethod,
    onSelectMethod,
    onClose,
    isLoading,
    errorMessage,
    onLocate
}: LocationConfigurationModalProps){
    const linkInputRef = useRef<HTMLInputElement>(null);

    // const latitudeInputRef = useRef<HTMLInputElement>(null); // TODO
    // const longitudeInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans animate-fade-in p-4">
            <div
                className="w-full max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4 sm:gap-5 bg-white items-center"
            >
                <Pinicon className='size-8 text-brand-navy'/>

                <div className="w-30 h-1 bg-brand-primary shrink-0" />

                <span className="text-lg sm:text-xl text-brand-navy text-center">Por favor, escoja un método de localización</span>

                <div
                    className="flex flex-col sm:flex-row gap-4 sm:gap-10 items-start sm:items-center"
                >
                    <div
                        className="flex gap-4 items-center"
                    >
                        <div 
                            onClick={() => {onSelectMethod('G_MAPS_LINK')}}
                            className={`size-5 rounded-full ${currentMethod=='G_MAPS_LINK' ? 'bg-brand-primary': 'bg-gray-500'}`}
                        />
                        <span className="text-lg sm:text-xl text-brand-navy whitespace-pre-line">{"Link de\ngoogle maps"}</span>

                    </div>
                    <div
                        className="flex gap-4 items-center"
                    >
                        <div 
                            onClick={() => {onSelectMethod('BROWSER')}}
                            className={`size-5 rounded-full ${currentMethod=='BROWSER' ? 'bg-brand-primary': 'bg-gray-500'}`}
                        />
                        <span className="text-lg sm:text-xl text-brand-navy whitespace-pre-line">{"Directo del\nnavegador"}</span>
                    </div>
                </div>

                {currentMethod === 'G_MAPS_LINK' && (
                    <input
                        type="text"
                        ref={linkInputRef}
                        className="w-full text-xl sm:text-3xl lg:text-4xl font-bold text-center shadow-[0_8px_16px_rgba(0,21,96,0.2)] rounded-md"
                        autoFocus
                    />
                )}

                {errorMessage != null && (
                    <span className="italic text-md text-red-600">
                        {errorMessage}
                    </span>
                )}

                {isLoading ? (
                    <div className="size-10 animate-spin rounded-full border-4 border-gray-300 border-t-brand-primary" aria-hidden="true" />
                ) : (
                <div className="flex w-full flex-col-reverse sm:flex-row gap-3 justify-end mt-2 pt-3 border-t border-white/10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-lg sm:text-xl font-bold rounded-lg bg-brand-secondary text-white hover:bg-orange-50 active:scale-95 transition-all duration-200 shadow-md cursor-pointer"
                    >
                        Cancelar
                    </button>

                    {/* Render the confirmation action button unless hard-blocked by invalid text fields */}
                    <button
                        onClick={() => onLocate(linkInputRef.current?.value ?? "")}
                        className={`px-4 py-2 text-lg sm:text-xl font-bold rounded-lg bg-brand-blue text-white active:scale-95 transition-all duration-200 shadow-md cursor-pointer `}
                    >
                        Localizar
                    </button>
                </div>
                )}

                <div className="w-3/4 h-1 bg-brand-primary shrink-0" />

                <span className="text-lg sm:text-xl text-brand-primary text-center">{"Ayudará al cliente a ubicar su restaurante"}</span>
                
            </div>
        </div>
    )
}
