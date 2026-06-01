interface GroupLabelButtonProps {
  onClick?: () => void;
}

export function GroupLabelButton({ onClick }: GroupLabelButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-16 h-16 bg-white rounded-xl shadow-yummizi border border-brand-navy/5 flex flex-col items-center justify-center p-2 text-center hover:scale-[1.02] cursor-pointer active:scale-[0.98] transition-all group"
    >
      <span className="font-heading font-bold text-[10px] text-brand-navy uppercase tracking-tighter leading-tight group-hover:text-brand-primary transition-colors">
        Group Labels
      </span>
    </button>
  );
}