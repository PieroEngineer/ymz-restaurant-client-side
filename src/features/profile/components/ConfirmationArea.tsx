export function ConfirmationArea() {
  return (
    <div className="flex flex-row items-center gap-6">
        
        {/* Confirmation sub container */}
        <div
            className="bg-brand-navy rounded-2xl shadow-lg
                        flex flex-col items-center
                        gap-2.5 p-4 w-56"
        >
            {/* white rectangle: italic caption above a medium image */}
            <div className="bg-white rounded-lg p-2 flex flex-col items-center gap-1.5 w-full">
                <span className="italic text-xs text-slate-600">
                {"Como el usuario te encuentra"}
                </span>
                <img
                // src={MOCK.confirmationImageUrl}
                src={"https://placehold.co/160x90/e5e7eb/6b7280?text=Vista+previa"}
                alt=""
                className="rounded-md w-full h-20 object-cover"
                />
            </div>

            {/* orange sub-button next to icon */}
            <button
                type="button"
                className="flex items-center gap-2 rounded-md px-4 py-1.5 shadow-sm"
                style={{ backgroundColor: "#ff751f" }}
            >
                <span className="text-white text-sm font-medium">
                {"Guardar"}
                </span>
                {/* icon-placeholder: save/check icon */}
            </button>
        </div>

        {/* Open restaurant button */}
        <div className="flex flex-col items-center gap-1.5">
            {/* bold text above */}
            <span className="text-sm font-bold text-slate-800">
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
                {/* icon-placeholder: arrow/external-link icon */}
            </button>

            {/* red italic text below */}
            <span className="italic text-xs text-red-600">
                {/* {MOCK.ctaBottomLabel} */}
                {"Por favor, complete los campos con * para abrir"}
            </span>
        </div>
    </div>
  );
}