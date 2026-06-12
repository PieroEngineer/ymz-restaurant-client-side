import type { ReactNode } from 'react';

interface MenuActionButtonProps {
  text: string;
  color?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export function MenuActionButton({
  text,
  color = 'bg-white',
  onClick,
  icon,
}: MenuActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${color} w-full flex-1 rounded-xl shadow-yummizi border border-brand-navy/5 flex items-center gap-2 px-2 py-1 text-center hover:scale-[1.02] cursor-pointer active:scale-[0.98] transition-all duration-200`}
    >
      {icon}
      <span className="font-heading font-bold text-xs text-brand-primary uppercase tracking-tighter leading-tight">
        {text}
      </span>
    </button>
  );
}
