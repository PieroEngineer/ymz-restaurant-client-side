

export function ConfigurationArea(

) {
    return (
    <div className="flex flex-row items-stretch">

        {/* Restaurant info card */}
        <section
            className="bg-[#ff6105] text-white rounded-2xl shadow-lg
                        flex flex-col items-center
                        gap-2.5 p-4 w-72"
            >
            {/* text next to icon */}
            <div className="flex items-center gap-2 self-start">
                {/* <span className="text-sm font-medium">{MOCK.scheduleLabel}</span> */}
                <span className="text-sm font-medium">{"Pollitos chicken"}</span>
                {/* icon-placeholder: schedule/clock icon */}
            </div>

            <hr
                className="w-full border-t"
                style={{ borderColor: 'white', opacity: 0.6 }}
            />

            {/* bold text */}
            {/* <span className="text-sm font-bold self-start">{MOCK.addressLabel}</span> */}
            <span className="text-sm font-bold self-start">{"Horario activo*"}</span>

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

                <span className="text-xs font-medium">a</span>

                <input
                    readOnly
                    // value={value}
                    value={"18:00\nPM"}
                    className={
                        "bg-white text-blue-700 text-sm rounded-md px-2 py-1 shadow-sm " +
                        "outline-none w-full "
                    }
                />
            </div>

            <hr
                className="w-full border-t"
                style={{ borderColor: 'white', opacity: 0.6 }}
            />

            {/* bold text */}
            <span className="text-sm font-bold self-start">Datos del local</span>

            {/* form: question label to the left of its input */}
            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between gap-2">
                    <label className="text-xs shrink-0">{"Ubicación*:"}</label>

                    <button
                        type="button"
                        className="bg-white rounded-md p-1.5 shadow-sm
                                flex items-center justify-center shrink-0"
                        aria-label={"Edición de ubicación"}
                    >
                        {/* icon-placeholder: clickable upload/logo icon */}
                    </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <label className="text-xs shrink-0">{"Núm. de contacto*:"}</label>

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

                <div className="flex items-center justify-between gap-2">
                    <label className="text-xs shrink-0">{"Núm. de pago*:"}</label>

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
                        gap-2.5 p-4 w-72"
            style={{ color: "#ff751f" }}
        >
            <div className="flex items-center gap-2 self-start">
                <span className="text-sm font-medium" style={{ color: "#ff751f" }}>
                    {/* {text} */}
                    {"QR de pago*:"}
                </span>
                <img
                    // src={imageUrl}
                    src={"https://placehold.co/48x48/ff751f/ffffff?text=1"}
                    alt=""
                    className="w-8 h-8 rounded-md object-cover shrink-0"
                />
                {/* icon-placeholder: edit/upload icon */}
            </div>

            <hr
                className="w-full border-t"
                style={{ borderColor: '#ff751f', opacity: 0.6 }}
            />

            <div className="flex items-center gap-2 self-start">
                <span className="text-sm font-medium" style={{ color: "#ff751f" }}>
                    {/* {text} */}
                    {"QR de pago*:"}
                </span>
                <img
                    // src={imageUrl}
                    src={"https://placehold.co/48x48/ff751f/ffffff?text=1"}
                    alt=""
                    className="w-8 h-8 rounded-md object-cover shrink-0"
                />
                {/* icon-placeholder: edit/upload icon */}
            </div>

            <hr
                className="w-full border-t"
                style={{ borderColor: '#ff751f', opacity: 0.6 }}
            />

            <span className="text-sm font-medium self-start">
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