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
      className={"relative bg-white w-full flex-1 rounded-xl shadow-yummizi border border-brand-navy/5 flex items-center gap-2 px-2 py-1 text-center hover:scale-[1.02] cursor-pointer active:scale-[0.98] transition-all duration-200"}
    >
      {icon}
      <span className="font-heading font-bold text-xs text-brand-primary uppercase tracking-tighter leading-tight">
        {text}
      </span>

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
