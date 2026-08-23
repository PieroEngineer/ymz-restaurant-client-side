import Checkicon from "@/features/profile/components/icon/Checkicon";
import Closeddooricon from "@/features/profile/components/icon/Closeddooricon";
import CloudloadingIcon from "@/features/profile/components/icon/Cloudloadingicon";
import Pencilicon2 from "@/features/profile/components/icon/Pencilicon2";
import type { DataState } from "@/features/profile/types/support/dataState.types";

interface ConfirmationAreaProps {
    confirmSaving: () => void,
    dataStatus: DataState
}

export function ConfirmationArea({
    confirmSaving,
    dataStatus
}: ConfirmationAreaProps) {

    const dataStatusIcon = {
        LOADING:  <CloudloadingIcon className='size-8 animate-pulse'/>,
        SYNC:  <Checkicon className='size-6'/>,
        ERROR:  <Pencilicon2 className='size-8'/>,
        EDITED: <Pencilicon2 className='size-8'/>,
    }

    return (
        <div className="flex flex-col items-center gap-6">
            
            {/* Confirmation sub container */}
            <div
                className="bg-brand-navy rounded-2xl shadow-lg
                            flex flex-col items-center
                            gap-2.5 p-4"
            >
                {/* white rectangle: italic caption above a medium image */}
                <div className="bg-white rounded-lg p-2 flex flex-col items-center gap-1.5 w-full">
                    <span className="italic text-md text-brand-primary">
                    {"Como el usuario te " + (dataStatus == 'SYNC' ? 'encuentra' : 'encontraría')}
                    </span>
                    <img
                    // src={MOCK.confirmationImageUrl}
                    src={"https://placehold.co/160x90/e5e7eb/6b7280?text=Vista+previa"}
                    alt=""
                    className="rounded-md w-full h-45 object-cover"
                    />
                </div>

                <div
                    className="flex items-center gap-3.5"
                >
                    {/* orange sub-button next to icon */}
                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-md px-4 py-1.5 shadow-sm transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
                        style={{ backgroundColor: "#ff751f" }}
                        disabled={dataStatus != 'EDITED' && dataStatus != 'ERROR'}
                        onClick={confirmSaving}
                    >
                        <span className="text-white text-xl font-medium">
                        {"Guardar"}
                        </span>
                    </button>

                    {dataStatusIcon[dataStatus]}
                </div>

            </div>

            {/* Open restaurant button */}
            <div className="relative flex flex-col items-center gap-1.5">
                {/* bold text above */}
                <span className="text-xl font-bold text-slate-800">
                    {"Estado"}
                </span>

                {/* white rounded rectangle: orange text next to icon */}
                <button
                    type="button"
                    className="bg-white rounded-2xl shadow-lg px-5 py-3
                            flex items-center gap-2"
                >
                    <span className="font-medium" style={{ color: "#ff751f" }}>
                        {"Cerrado"}
                    </span>
                    <Closeddooricon className = 'size-8'/>
                </button>

                {dataStatus=='ERROR' && (
                    <span className="italic text-md text-red-600">
                        {"La última carga falló, por favor, reintentar en unos momentos"}
                    </span>
                )}

                <div className="absolute inset-0 bg-black/60 rounded-xl backdrop-blur-[1px] flex items-center justify-center cursor-not-allowed select-none">
                    <span className="text-white text-sm font-bold tracking-wider uppercase">
                        Próximamente
                    </span>
                </div>
            </div>
        </div>
    );
}