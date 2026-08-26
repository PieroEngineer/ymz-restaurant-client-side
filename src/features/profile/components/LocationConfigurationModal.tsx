import Pinicon from "@/features/profile/components/icon/PinIcon";
import type { CoordinatesSelectionMethodToken } from "@/features/profile/types/support/coordinates.type";
import { useRef, useState } from "react";

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
    if (!isOpen) return null; 

    const linkInputRef = useRef<HTMLInputElement>(null);

    // const latitudeInputRef = useRef<HTMLInputElement>(null); // TODO
    // const longitudeInputRef = useRef<HTMLInputElement>(null);

    const [linkText, setLinkText] = useState('')

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans animate-fade-in">
            <div
                className="rounded-2xl p-6 shadow-xl flex flex-col gap-5 bg-white items-center"
            >
                <Pinicon className='size-8 text-brand-navy'/>

                <div className="w-30 h-1 bg-brand-primary shrink-0" />

                <span className="text-xl text-brand-navy text-center">Por favor, escoja un método de localización</span>

                <div
                    className="flex gap-10 items-center"
                >
                    <div
                        className="flex gap-4 items-center"
                    >
                        <div 
                            onClick={() => {onSelectMethod('G_MAPS_LINK')}}
                            className={`size-5 rounded-full ${currentMethod=='G_MAPS_LINK' ? 'bg-brand-primary': 'bg-gray-500'}`}
                        />
                        <span className="text-xl text-brand-navy whitespace-pre-line">{"Link de\ngoogle maps"}</span>

                    </div>
                    <div
                        className="flex gap-4 items-center"
                    >
                        <div 
                            onClick={() => {onSelectMethod('BROWSER')}}
                            className={`size-5 rounded-full ${currentMethod=='BROWSER' ? 'bg-brand-primary': 'bg-gray-500'}`}
                        />
                        <span className="text-xl text-brand-navy whitespace-pre-line">{"Directo del\nnavegador"}</span>
                    </div>
                </div>

                {currentMethod === 'G_MAPS_LINK' && (
                    <input
                        type="text"
                        ref={linkInputRef}
                        className="text-4xl font-bold text-center shadow-[0_8px_16px_rgba(0,21,96,0.2)] rounded-md"
                        defaultValue={linkText}
                        onBlur={()=>{
                            setLinkText(linkInputRef.current?.value ?? "")
                        }}
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
                    <div className="flex gap-3 justify-end mt-2 pt-3 border-t border-white/10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xl font-bold rounded-lg bg-brand-secondary text-white hover:bg-orange-50 active:scale-95 transition-all duration-200 shadow-md cursor-pointer"
                    >
                        Cancelar
                    </button>

                    {/* Render the confirmation action button unless hard-blocked by invalid text fields */}
                    <button
                        onClick={() => {onLocate(linkText)}}
                        className={`px-4 py-2 text-xl font-bold rounded-lg bg-brand-blue text-white active:scale-95 transition-all duration-200 shadow-md cursor-pointer `}
                    >
                        Localizar
                    </button>
                </div>
                )}

                <div className="w-3/4 h-1 bg-brand-primary shrink-0" />

                <span className="text-xl text-brand-primary">{"Ayudará al cliente a ubicar su restaurante"}</span>
                
            </div>
        </div>
    )
}