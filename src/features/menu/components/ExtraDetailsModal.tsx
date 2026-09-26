import type { DishItem } from '@/features/menu/types/domain.types';
import type { DishTypeToken } from '@/features/menu/types/support/selection.types';

interface ExtraDetailsModalProps {
    isOpen: boolean;
    dish: DishItem | null;
    complementaryDishes: DishItem[];
    allComplementsSelected: boolean;
    onClose: () => void;
    onUpdatePrepTime: (value: string) => void;
    onUpdateDishType: (value: DishTypeToken) => void;
    onToggleComplement: (dishId: string, checked: boolean) => void;
    onToggleAllComplements: (checked: boolean) => void;
}

export function ExtraDetailsModal({
    isOpen,
    dish,
    complementaryDishes,
    allComplementsSelected,
    onClose,
    onUpdatePrepTime,
    onUpdateDishType,
    onToggleComplement,
    onToggleAllComplements,
}: ExtraDetailsModalProps){
    if (!isOpen || !dish) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans animate-fade-in p-4" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="extra-details-title"
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-xl bg-white p-5 shadow-2xl sm:p-7"
            >
                <header className="mb-6 border-b border-slate-200 pb-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-primary">{dish.name || 'Plato'}</p>
                    <h2 id="extra-details-title" className="mt-1 text-xl font-bold text-brand-navy">Detalles extras</h2>
                </header>

                <div className="space-y-5">
                    <label className="block text-sm font-semibold text-brand-navy">
                        <span className="mb-2 flex items-center gap-2">
                            Tiempo de preparación
                            <span className="group relative inline-flex items-center">
                                <span aria-label="Información" className="flex size-4 cursor-help items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-400">?</span>
                                <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-48 -translate-x-1/2 rounded-md bg-brand-navy px-3 py-2 text-xs font-normal text-white shadow-lg group-hover:block group-focus-within:block">Los usuarios no verán este tiempo</span>
                            </span>
                        </span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                step="1"
                                inputMode="numeric"
                                value={dish.prepTime}
                                onChange={(event) => onUpdatePrepTime(event.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal shadow-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                            />
                            <span className="text-sm font-normal text-slate-500">min</span>
                        </div>
                    </label>

                    <DishTypeSelect value={dish.type} onChange={onUpdateDishType} />

                    {dish.type === 'MAIN' && (
                        <ComplementDishChecklist
                            dishes={complementaryDishes}
                            selectedIds={dish.availableComplementaryDishIds}
                            allSelected={allComplementsSelected}
                            onToggle={onToggleComplement}
                            onToggleAll={onToggleAllComplements}
                        />
                    )}
                </div>

                <footer className="mt-7 flex justify-end border-t border-slate-200 pt-4">
                    <button type="button" onClick={onClose} className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#e06114] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
                        Listo
                    </button>
                </footer>
            </div>
        </div>
    )
}

function DishTypeSelect({ value, onChange }: { value: DishTypeToken; onChange: (value: DishTypeToken) => void }) {
    return (
        <label className="block text-sm font-semibold text-brand-navy">
            <span className="mb-2 block">Tipo de plato</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value as DishTypeToken)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal shadow-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            >
                <option value="MAIN">Principal</option>
                <option value="COMPLEMENTARY">Complemento</option>
            </select>
        </label>
    );
}

function ComplementDishChecklist({
    dishes,
    selectedIds,
    allSelected,
    onToggle,
    onToggleAll,
}: {
    dishes: DishItem[];
    selectedIds: string[];
    allSelected: boolean;
    onToggle: (dishId: string, checked: boolean) => void;
    onToggleAll: (checked: boolean) => void;
}) {
    return (
        <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-semibold text-brand-navy">Incluir complementos</legend>
            {dishes.length === 0 ? (
                <p className="rounded-lg bg-slate-50 px-3 py-4 text-sm text-slate-500">Incluye otros platos en el tipo "Complemento" para verlos aquí</p>
            ) : (
                <div className="max-h-52 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-50">
                        <input type="checkbox" checked={allSelected} onChange={(event) => onToggleAll(event.target.checked)} className="size-4 accent-brand-primary" />
                        Seleccionar todos
                    </label>
                    {dishes.map((complement) => (
                        <label key={complement.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-slate-700 hover:bg-slate-50">
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(complement.id)}
                                onChange={(event) => onToggle(complement.id, event.target.checked)}
                                className="size-4 accent-brand-primary"
                            />
                            <span className="truncate">{complement.name || 'Plato sin nombre'}</span>
                        </label>
                    ))}
                </div>
            )}
        </fieldset>
    );
}