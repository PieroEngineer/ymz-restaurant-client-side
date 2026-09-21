import Editpicicon from "@/features/profile/components/icons/Editpicicon";
import Orangepencilicon from "@/features/profile/components/icons/Orangepencilicon";
import Pencilicon2 from "@/features/profile/components/icons/Pencilicon2";
import PinIcon from "@/features/profile/components/icons/PinIcon";
import { useInteraction } from "@/features/profile/hooks/useInteraction";
import type { RestaurantResourceTypes } from "@/features/profile/types/support/imageManage.types";
import type { RestaurantStringRegularFields } from "@/features/profile/types/support/restaurantReduced.types";
import { useRef } from "react";

interface ConfigurationAreaProps {
    restaurantName: string;
    onUpdateStringField: (fieldName: keyof RestaurantStringRegularFields, newValue: string) => void;
    phoneNumberToPay: string;
    phoneNumberToContact: string;
    qrUrl: string;
    logoUrl: string;
    dishesToShow: [string, string, string];
    coordinates: [number, number];
    onLocalImageImported: (event: React.ChangeEvent<HTMLInputElement>, selectedImage: RestaurantResourceTypes | null) => void;
    onOpenLocationModal: () => void;
}

export function ConfigurationArea({
    restaurantName,
    onUpdateStringField,
    phoneNumberToPay,
    phoneNumberToContact,
    qrUrl,
    logoUrl,
    dishesToShow,
    coordinates,
    onLocalImageImported,
    onOpenLocationModal
}: ConfigurationAreaProps) {

    const updateImageInputRef = useRef<HTMLInputElement>(null);

    const interaction = useInteraction(updateImageInputRef)

    const updateNameInputRef = useRef<HTMLInputElement>(null);
    const updatePhoneNumberToPayInputRef = useRef<HTMLInputElement>(null);
    const updatePhoneNumberToContactInputRef = useRef<HTMLInputElement>(null);
    
    return (
    <div className="w-full landscape:w-auto lg:w-auto flex flex-col landscape:flex-row lg:flex-row items-stretch gap-4 landscape:gap-0 lg:gap-0">

        <input
            ref={updateImageInputRef}
            type="file"
            accept="image/*"
            onChange={ (event) => onLocalImageImported(event, interaction.imageToEdit) }
            className="hidden"
        />
        

        {/* Restaurant info card */}
        <section
            className="w-full landscape:w-auto lg:w-auto bg-brand-tertiary text-white rounded-2xl shadow-lg flex flex-col items-center gap-2.5 p-4"
            >
            {/* text next to icon */}
            <div className="flex justify-center items-center gap-2 font-accent">

                {interaction.isEditingName ? (
                    <input
                        type="text"
                        ref={updateNameInputRef}
                        className="w-full min-w-0 text-2xl sm:text-3xl lg:text-4xl font-bold text-center"
                        defaultValue={restaurantName}
                        onBlur={()=>{
                            onUpdateStringField("restaurantName", updateNameInputRef.current?.value ?? "")
                            interaction.toggleNameEdition()
                        }}
                        autoFocus
                    />
                ) : (
                    <span 
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center wrap-break-word"
                        onClick={interaction.toggleNameEdition}
                    >
                        {restaurantName || "Click aquí..."}
                    </span>
                )}
                
                <Pencilicon2 className='size-8'/>
            </div>

            <hr
                className="w-full border-t"
                style={{ borderColor: 'white', opacity: 0.6 }}
            />

            {/* bold text */}
            <span className="text-xl font-bold self-start">{"Horario activo*"}</span>

            {/* textfield + "a" + textfield */}
            <div className="relative flex items-center gap-2 w-full">
                <input
                    readOnly
                    // value={value}
                    value={"8:00\nAM"}
                    className={
                        "bg-white text-blue-700 text-sm rounded-md px-2 py-1 shadow-sm " +
                        "outline-none w-full "
                    }
                />

                <span className="text-xl font-medium">a</span>

                <input
                    readOnly
                    // value={value}
                    value={"18:00\nPM"}
                    className={
                        "bg-white text-blue-700 text-md rounded-md px-2 py-1 shadow-sm " +
                        "outline-none w-full "
                    }
                />
                <div className="absolute inset-0 bg-black/60 rounded-xl backdrop-blur-[1px] flex items-center justify-center cursor-not-allowed select-none">
                    <span className="text-white text-sm font-bold tracking-wider uppercase">
                        Próximamente
                    </span>
                </div>
            </div>

            <hr
                className="w-full border-t"
                style={{ borderColor: 'white', opacity: 0.6 }}
            />

            {/* bold text */}
            <span className="text-xl font-bold self-start">Datos del local</span>

            {/* form: question label to the left of its input */}
            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between gap-2">
                    <label className="text-md shrink-0">{"Ubicación*:"}</label>

                    <span className="text-sm sm:text-md shrink lg:shrink-0 text-right text-white min-w-0 wrap-break-word">
                        {coordinates[0] === 0 && coordinates[1] === 0 ? "No asignada" : `${coordinates[0].toFixed(6)}, ${coordinates[1].toFixed(6)}`}   {/**TODO: Change the empty coordinates by null (but it needs backend changes) */}
                    </span>

                    <button
                        type="button"
                        className="bg-transparent rounded-md p-1.5 shadow-sm
                                flex items-center justify-center shrink-0"
                        onClick={onOpenLocationModal}
                        aria-label={"Edición de ubicación"}
                    >
                        <PinIcon className='size-8'/>
                    </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <label className="text-md shrink-0">{"Núm. de contacto*:"}</label>

                    <input
                        type="text"
                        ref = {updatePhoneNumberToContactInputRef}
                        defaultValue={phoneNumberToContact}
                        className={
                            "bg-white text-blue-700 text-sm rounded-md px-2 py-1 shadow-sm outline-none w-full max-w-38"
                        }
                        onBlur={()=>{
                            onUpdateStringField("peruvianContactNumber", updatePhoneNumberToContactInputRef.current?.value ?? "")
                        }}
                    />
                </div>

                <div className="flex items-center justify-between gap-2">
                    <label className="text-md shrink-0">{"Núm. de pago*:"}</label>

                    <input
                        type="text"
                        ref = {updatePhoneNumberToPayInputRef}
                        defaultValue={phoneNumberToPay}
                        className={
                            "bg-white text-blue-700 text-sm rounded-md px-2 py-1 shadow-sm " +
                            "outline-none w-full max-w-38"
                        }
                        onBlur={()=>{
                            onUpdateStringField("peruvianPaymentNumber", updatePhoneNumberToPayInputRef.current?.value ?? "")
                        }}
                    />
                </div>
            </div>
        </section> 
        {/** TODO: Place a message to clarify that it's important to give a correct number */}

        {/* Restaurant media card */}
        <section
            className="w-full landscape:w-auto lg:w-auto bg-white rounded-2xl shadow-lg border border-orange-100
                        flex flex-col items-center
                        gap-2.5 p-4"
            style={{ color: "#ff751f" }}
        >
            <div className="flex items-center gap-2 self-start">
                <span className="text-xl font-medium" style={{ color: "#ff751f" }}>
                    {"QR de pago*:"}
                </span>
                {qrUrl && (
                    <img
                        src={qrUrl}
                        alt=""
                        className="size-20 rounded-md object-cover shrink-0"
                    />
                )}
                    <Orangepencilicon 
                    onClick={() => { interaction.importNewLocalImage('QR') }}
                    className='size-8  fill-brand-primary transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95'
                    />
            </div>

            <hr
                className="w-full border-t"
                style={{ borderColor: '#ff751f', opacity: 0.6 }}
            />

            <div className="flex items-center gap-2 self-start">
                <span className="text-xl font-medium" style={{ color: "#ff751f" }}>
                    {"Logo*:"}
                </span>
                {logoUrl && (
                    <img
                        src={logoUrl}
                        alt=""
                        className="size-20 rounded-md object-cover shrink-0"
                    />
                )}
                    <Orangepencilicon 
                        onClick={ () => {interaction.importNewLocalImage('LOGO')} }
                        className='size-8  fill-brand-primary transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95'
                    />
            </div>

            <hr
                className="w-full border-t"
                style={{ borderColor: '#ff751f', opacity: 0.6 }}
            />

            <span className="text-xl font-medium self-start">
                {"Platos principales (Al menos 1*)"}
            </span>

            {/* 3 icons horizontally ordered */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 pt-1 flex-wrap landscape:flex-nowrap lg:flex-nowrap">
                {(['FRONT1', 'FRONT2', 'FRONT3'] as const).map((imageType, index) => (
                    <button
                        key={imageType}
                        type="button"
                        className="group relative size-16 overflow-hidden rounded-md bg-slate-300 transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
                        onClick={() => { interaction.importNewLocalImage(imageType) }}
                        aria-label={`Editar plato ${index + 1}`}
                    >
                        {dishesToShow[index] && (
                            <img
                                src={dishesToShow[index]}
                                alt=""
                                className="size-full object-cover"
                            />
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <Editpicicon className="size-10" />
                        </span>
                    </button>
                ))}
            </div>
        </section>
    </div>
  );
}
