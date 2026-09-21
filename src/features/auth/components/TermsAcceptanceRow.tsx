interface TermsAcceptanceRowProps {
    termsAccepted: boolean;
    onTermsAcceptanceToggled: () => void;
    onOpenTermsModal: () => void;
}

export function TermsAcceptanceRow({
    termsAccepted,
    onTermsAcceptanceToggled,
    onOpenTermsModal,
}: TermsAcceptanceRowProps) {
    return (
        <div className="flex max-w-full flex-wrap items-center gap-x-1 gap-y-1">
            <button
                type="button"
                aria-pressed={termsAccepted}
                className={`size-6 shrink-0 rounded-sm ${termsAccepted ? "bg-brand-tertiary" : "bg-white"}`}
                onClick={onTermsAcceptanceToggled}
            />
            <span className="font-accent text-brand-navy pl-1">
                {"Acepto los"}
            </span>
            <button
                type="button"
                className="inline-flex min-h-11 items-center underline font-accent text-brand-secondary"
                onClick={onOpenTermsModal}
            >
                {"Términos y Condiciones"}
            </button>
        </div>
    );
}
