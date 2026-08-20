import Orangepencilicon from "@/features/profile/components/icon/Orangepencilicon";
import Pencilicon2 from "@/features/profile/components/icon/Pencilicon2";
import PinIcon from "@/features/profile/components/icon/PinIcon";


export function ConfigurationArea(

) {
    return (
    <div className="flex flex-row items-stretch">

        {/* Restaurant info card */}
        <section
            className="bg-[#ff6105] text-white rounded-2xl shadow-lg
                        flex flex-col items-center
                        gap-2.5 p-4 "
            >
            {/* text next to icon */}
            <div className="flex justify-center items-center gap-2 font-accent">
                {/* <span className="text-sm font-medium">{MOCK.scheduleLabel}</span> */}
                <span className="text-4xl font-bold text-center">{"Pollitos chicken"}</span>
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
                        readOnly
                        // value={value}
                        value={"+51 950214782"}
                        className={
                            "bg-white text-blue-700 text-sm rounded-md px-2 py-1 shadow-sm outline-none w-full max-w-38"
                        }
                    />
                </div>

                <div className="flex items-center justify-between gap-2">
                    <label className="text-md shrink-0">{"Núm. de pago*:"}</label>

                    <input
                        readOnly
                        // value={value}
                        value={"+51 950214782"}
                        className={
                            "bg-white text-blue-700 text-sm rounded-md px-2 py-1 shadow-sm " +
                            "outline-none w-full max-w-38"
                        }
                    />
                </div>
            </div>
        </section>

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
                <img
                    // src={imageUrl}
                    src={"https://placehold.co/48x48/ff751f/ffffff?text=1"}
                    alt=""
                    className="size-20 rounded-md object-cover shrink-0"
                />
                    <Orangepencilicon className='size-8  fill-brand-primary'/>
            </div>

            <hr
                className="w-full border-t"
                style={{ borderColor: '#ff751f', opacity: 0.6 }}
            />

            <div className="flex items-center gap-2 self-start">
                <span className="text-xl font-medium" style={{ color: "#ff751f" }}>
                    {"Logo*:"}
                </span>
                <img
                    // src={imageUrl}
                    src={"https://placehold.co/48x48/ff751f/ffffff?text=2"}
                    alt=""
                    className="size-20 rounded-md object-cover shrink-0"
                />
                    <Orangepencilicon className='size-8  fill-brand-primary'/>
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
                {/* icon-placeholder: social icon 1 */}
                {/* icon-placeholder: social icon 2 */}
                {/* icon-placeholder: social icon 3 */}
            </div>
        </section>

    </div>
  );
}