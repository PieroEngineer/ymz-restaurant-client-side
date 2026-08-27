
interface PaymentViewModalProps{
    isOpen: boolean,
    paymentImageUrl: string | null,
    onClose: () => void,
    // onContactUser: () => void
}

export function PaymentViewModal({
    isOpen,
    paymentImageUrl,
    onClose,
    // onContactUser,   // TODO: For this, we need that the customer's client side include the customer's phone number in the payload of the order
}: PaymentViewModalProps){
    if (!isOpen) return null; 

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans animate-fade-in">
             <div
                className="rounded-2xl p-20 shadow-xl flex flex-col gap-5 bg-white items-center"
            >
                <span className="text-xl text-brand-navy text-center">Confirmación de pago</span>

                <div className="w-1/2 h-1 bg-brand-primary shrink-0" />

                {paymentImageUrl == null ? (
                    <div className="w-100 h-100 rounded-md bg-brand-primary/10 flex items-center justify-center">
                        <div className="size-10 animate-spin rounded-full border-4 border-gray-300 border-t-brand-primary" aria-hidden="true" />
                    </div>
                ) : (
                    <img
                        src={paymentImageUrl}
                        alt=""
                        className="h-70 rounded-md object-cover shrink-0"
                    />
                )}

                <div className="flex gap-3 justify-end mt-2 pt-3 border-t border-white/10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xl font-bold rounded-lg bg-brand-secondary text-white hover:bg-orange-50 active:scale-95 transition-all duration-200 shadow-md cursor-pointer"
                    >
                        Cancelar
                    </button>

                    {/* Render the confirmation action button unless hard-blocked by invalid text fields */}
                    {/* <button
                        onClick={() => {onContactUser()}}
                        className={`px-4 py-2 text-xl font-bold rounded-lg bg-brand-blue text-white active:scale-95 transition-all duration-200 shadow-md cursor-pointer `}
                    >
                        Contactar usuario
                    </button> */}
                </div>

                <div className="w-1/2 h-1 bg-brand-primary shrink-0" />
                
                <span className="text-xl text-brand-navy text-center whitespace-pre-line">{'Tiempo de llegada y pago confirmados 😁\nSepara mesa y prepara la comida 👨‍🍳'}</span>

            </div>
        </div>
    )
}