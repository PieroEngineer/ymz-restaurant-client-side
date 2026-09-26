//  ✏️  AIHERE

interface ExtraDetailsModalProps{
    // The mentioned parameters
}

export function ExtraDetailsModal({
    // The mentioned parameters
}: ExtraDetailsModalProps){
    if (!isOpen) return null;



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans animate-fade-in p-4">
            <div
                className=""
            >
                {/** A modal with with white background, rounded corners (The modifiables of this modal should be updated with "onUpdateDishData" of "menuDraft")
                 * 
                 * A title saying "Detalles extras"
                 * 
                 * The text field for the preparing time. This is the textfield that was in "DishChart" with the label "⏱️ ITEM PREPARATION TIME COMPONENT CELL" 
                 * Its value correspond to state "dish.prepTime" 
                 * Its label is "Tiempo de preparación"
                 * Add a small, faint icon "(?)" that when the user hovers the cursor over it, it show a small cloud saying "Los usuarios no verán este tiempo"
                 * 
                 * A nice dropdown (Modularize the UI to keep abstraction) with rounded corners, shadow and white background that allow user select between the string "MAIN" and "COMPLEMENT". 
                 * Its value correspond to the state "dish.type"
                 * Its label is "Tipo de plato"
                 * 
                 * 
                 * A checklist  (Modularize the UI to keep abstraction) with that is visible only when "dish.type" is "MAIN"
                 * It takes all the "dish.name"s of "MenuDraft" to show in the list and save the checked ones in "dish.availableComplementaryDishIds"
                 * Also include a checkbox saying "Seleccionar todos" that check all the list's elements 
                 * If the list is empty, show a message saying "Incluye platos en el tipo "Complemento" para verlos aquí"
                 * Its label is "Incluir  complementos" 
                 * 
                 * 
                 * A button saying "Listo" whose only purpose is close the modal.
                 * 
                */}

            </div>

        </div>
    )
}