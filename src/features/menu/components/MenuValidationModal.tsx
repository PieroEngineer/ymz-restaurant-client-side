import { type InvalidDishDetail, formatPageNumbersList } from '@/features/menu/utils/menuValidators';

// 🆕 Expanded modes to house the new operational confirmation situations
export type MenuModalMode = 'EMPTY_PAGES' | 'INVALID_DISHES' | 'CONFIRM_DELETE' | 'CONFIRM_SYNC' | null;

interface MenuActionModalProps {
  isOpen: boolean;
  mode: MenuModalMode;
  emptyPageNumbers: number[];
  invalidDishes: InvalidDishDetail[];
  activePageNumber?: number; // 🆕 Added to dynamically render which page is being targeted for deletion
  onClose: () => void;
  onProceedAnyway: () => void; // Used for "Upload Anyway", "Confirm Delete", and "Proceed Sync"
}

export function MenuActionModal({
  isOpen,
  mode,
  emptyPageNumbers = [],
  invalidDishes = [],
  activePageNumber = 0,
  onClose,
  onProceedAnyway,
}: MenuActionModalProps) {
  if (!isOpen || !mode) return null;

  // 📝 Helper variables to resolve contextual text values cleanly based on the state mode
  const isDestructive = mode === 'CONFIRM_DELETE' || mode === 'INVALID_DISHES';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans animate-fade-in">
      <div 
        className="w-120 rounded-2xl p-6 shadow-2xl text-white flex flex-col gap-5 border border-white/10"
        style={{ backgroundColor: '#d94500' }}
      >
        {/* 🏷️ Dynamic Header Section */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {mode === 'CONFIRM_DELETE' && '🗑️'}
            {mode === 'CONFIRM_SYNC' && '☁️'}
            {(mode === 'EMPTY_PAGES' || mode === 'INVALID_DISHES') && '😯'}
          </span>

          <h3 className="text-xl font-bold tracking-tight">
            {mode === 'CONFIRM_DELETE' && 'Remover página del menú'}
            {mode === 'CONFIRM_SYNC' && 'Guardar tu menu'}
            {mode === 'EMPTY_PAGES' && 'Páginas sin comidas asignadas'}
            {mode === 'INVALID_DISHES' && 'Datos faltantes en tabla'}

          </h3>
        </div>

        {/* 💬 Dynamic Body Content Section */}
        <div className="text-base leading-relaxed text-orange-50 font-medium overflow-y-auto max-h-60 pr-1">
          {mode === 'CONFIRM_DELETE' && (
            <p>
              ¿Deseas eliminar <span className="font-extrabold">La página {activePageNumber}</span>? Esta acción también eliminará las comidas adjuntas a esta página.
            </p>
          )}
          {mode === 'CONFIRM_SYNC' && (
            <p>
              ¿Confirma el guardado de su menu?
            </p>
          )}
          {mode === 'EMPTY_PAGES' && (
            <p>
              <span className="font-extrabold underline">{formatPageNumbersList(emptyPageNumbers)}</span> comidas adjuntas. Por favor, clickee sobre la image del menú para agregarlas.
            </p>
          )}
          {mode === 'INVALID_DISHES' && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold border-b border-white/20 pb-2">
                Aún no se puede guardar los cambios, porque hay comidas con datos incompletos. <br /><br />Por favor, completelos en la tabla de la derecha.
              </p>
              <ul className="flex flex-col gap-3 mt-1">
                {invalidDishes.map((dish, idx) => (
                  <li key={idx} className="bg-white/10 rounded-lg p-3 flex flex-col gap-1">
                    <div className="flex justify-between items-center font-bold text-white text-sm">
                      <span>🍽️ {dish.dishName}</span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Página {dish.pageNumber}</span>
                    </div>
                    <div className="text-xs text-orange-100 flex gap-1.5 mt-0.5 flex-wrap">
                      <span className="font-semibold text-white">👉  Faltante:</span>
                      {dish.missingFields.join(', ')}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Operational Footer Controls (Action Button Grid Blocks) */}
        <div className="flex gap-3 justify-end mt-2 pt-3 border-t border-white/10">

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold rounded-lg bg-white text-brand-secondary hover:bg-orange-50 active:scale-95 transition-all duration-200 shadow-md cursor-pointer"
          >
            Cancelar
          </button>

          {/* Render the confirmation action button unless hard-blocked by invalid text fields */}
          {mode !== 'INVALID_DISHES' && (
            <button
              onClick={onProceedAnyway}
              className={`px-4 py-2 text-sm font-bold rounded-lg bg-white active:scale-95 transition-all duration-200 shadow-md cursor-pointer ${
                isDestructive ? 'text-red-600 hover:bg-red-50' : 'text-brand-secondary hover:bg-orange-50'
              }`}
            >
              {mode === 'CONFIRM_DELETE' && 'Sí, borrar'}
              {mode === 'CONFIRM_SYNC' && 'Sí, sincronizar'}
              {mode === 'EMPTY_PAGES' && 'Subir de todas formas'}

            </button>
          )}
        </div>
      </div>
    </div>
  );
};