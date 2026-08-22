import Editpicicon from "@/features/profile/components/icon/Editpicicon";
import Orangepencilicon from "@/features/profile/components/icon/Orangepencilicon";
import Pencilicon2 from "@/features/profile/components/icon/Pencilicon2";
import PinIcon from "@/features/profile/components/icon/PinIcon";
import { useInteraction } from "@/features/profile/hooks/useInteraction";
import { useLocalImage } from "@/features/profile/hooks/useLocalImage";
import type { Restaurant } from "@/features/profile/types/domain.types";
import { useRef } from "react";

interface ConfigurationAreaProps {
    restaurantName: string;
    onUpdateStringField: (fieldName: keyof Omit<Restaurant, "dishesToShow" | "coordinates">, newValue: string) => void;
    phoneNumberToPay: string;
    phoneNumberToContact: string;
    qrUrl: string;
    logoUrl: string;
    dishesToShow: [string, string, string];
    coordinates: [number, number];
    onUpdateDemostrationImageUrl: (position: 0 | 1 | 2, newImageUrl: string) => void
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
    onUpdateDemostrationImageUrl
}: ConfigurationAreaProps) {

    const updateImageInputRef = useRef<HTMLInputElement>(null);
    //X const updateLogoInputRef = useRef<HTMLInputElement>(null);
    //X const updateDishesToShowInputRef = useRef<HTMLInputElement>(null);

    const interaction = useInteraction(updateImageInputRef)

    const localImage = useLocalImage(
        qrUrl, 
        logoUrl, 
        dishesToShow,
        onUpdateStringField,
        onUpdateDemostrationImageUrl
    )

    console.log(`🔎  Draft logoUrl ${logoUrl}`)
    console.log(`🔎  Local logoUrl ${localImage.logoImageUrl}`)

    const updateNameInputRef = useRef<HTMLInputElement>(null);
    const updatePhoneNumberToPayInputRef = useRef<HTMLInputElement>(null);
    const updatePhoneNumberToContactInputRef = useRef<HTMLInputElement>(null);
    
    return (
    <div className="flex flex-row items-stretch">

        <input
            ref={updateImageInputRef}
            type="file"
            accept="image/*"
            onChange={ (event) => localImage.onLocalImageImported(event, interaction.imageToEdit) }
            className="hidden"
        />
        

        {/* Restaurant info card */}
        <section
            className="bg-brand-tertiary text-white rounded-2xl shadow-lg flex flex-col items-center gap-2.5 p-4 "
            >
            {/* text next to icon */}
            <div className="flex justify-center items-center gap-2 font-accent">

                {interaction.isEditingName ? (
                    <input
                        type="text"
                        ref={updateNameInputRef}
                        className="text-4xl font-bold text-center"
                        defaultValue={restaurantName}
                        onBlur={()=>{
                            onUpdateStringField("restaurantName", updateNameInputRef.current?.value ?? "")
                            interaction.toggleNameEdition()
                        }}
                        autoFocus
                    />
                ) : (
                    <span 
                        className="text-4xl font-bold text-center"
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
            <div className="flex items-center gap-2 w-full">
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

                    <button
                        type="button"
                        className="bg-transparent rounded-md p-1.5 shadow-sm
                                flex items-center justify-center shrink-0"
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
            className="bg-white rounded-2xl shadow-lg border border-orange-100
                        flex flex-col items-center
                        gap-2.5 p-4"
            style={{ color: "#ff751f" }}
        >
            <div className="flex items-center gap-2 self-start">
                <span className="text-xl font-medium" style={{ color: "#ff751f" }}>
                    {"QR de pago*:"}
                </span>
                {localImage.qrImageUrl && (
                    <img
                        src={localImage.qrImageUrl}
                        alt=""
                        className="size-20 rounded-md object-cover shrink-0"
                    />
                )}
                    <Orangepencilicon 
                    onClick={() => { interaction.importNewLocalImage('QR') }}
                    className='size-8  fill-brand-primary'
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
                {localImage.logoImageUrl && (
                    <img
                        src={localImage.logoImageUrl}
                        alt=""
                        className="size-20 rounded-md object-cover shrink-0"
                    />
                )}
                    <Orangepencilicon 
                        onClick={ () => {interaction.importNewLocalImage('LOGO')} }
                        className='size-8  fill-brand-primary'
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
            <div className="flex items-center gap-4 pt-1">
                { localImage.frontImagesUrls[0] &&
                    <div className="group relative inline-block h-50 w-75 overflow-hidden rounded-lg">  {/**✏️Add the clickables */}
                   
                    <img
                        src={localImage.frontImagesUrls[0]}
                        alt=""
                        className="size-16 rounded-md object-cover shrink-0"
                    />
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Editpicicon className="size-8"/>
                    </div>
                </div>
                }
                
                { localImage.frontImagesUrls[1] &&
                    <img
                        src={localImage.frontImagesUrls[1]}
                        alt=""
                        className="size-16 rounded-md object-cover shrink-0"
                    />
                }

                { localImage.frontImagesUrls[2] &&
                    <img
                        src={localImage.frontImagesUrls[2]}
                        alt=""
                        className="size-16 rounded-md object-cover shrink-0"
                    />
                }
            </div>
        </section>

    </div>
  );
}