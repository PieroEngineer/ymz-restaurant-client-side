import type { ReactNode } from 'react';

interface MenuActionButtonProps {
  text: string;
  comingSoonCover?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}

export function MenuActionButton({
  text,
  onClick,
  comingSoonCover = false,
  disabled = false,
  icon,
}: MenuActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled = {disabled}
      className={"relative bg-white min-w-32 lg:min-w-0 lg:w-full lg:flex-1 rounded-xl shadow-yummizi border border-brand-navy/5 flex flex-col sm:flex-row lg:flex-row items-center justify-center gap-1.5 sm:gap-2 px-2 py-2 lg:py-1 text-center hover:scale-[1.02] cursor-pointer active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"}
    >
      <span className="font-heading font-bold text-[11px] sm:text-xs text-center sm:text-right text-brand-primary uppercase leading-tight">
        {text}
      </span>
      {icon}

      {comingSoonCover && (
        <div className="absolute inset-0 bg-black/60 rounded-xl backdrop-blur-[1px] flex items-center justify-center cursor-not-allowed select-none">
            <span className="text-white text-sm font-bold tracking-wider uppercase">
                Próximamente
            </span>
        </div>
      )
      }
    </button>
  );
}
