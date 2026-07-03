import type { SyncStatusType } from '@/features/menu/types/syncStatus.types';

interface SyncStatusIndicatorProps {
  status: SyncStatusType;
}

export function SyncStatusIndicator({ status }: SyncStatusIndicatorProps) {
  const layoutMap = {
    Synchronized: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      icon: '🟢',
      label: 'Menú sincronizado'
    },
    Loading: {
      bg: 'bg-blue-50 border-blue-200 text-blue-700 animate-pulse',
      icon: '⏳',
      label: 'Guardando cambios...'
    },
    Unsynchronized: {
      bg: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: '🟠',
      label: 'Cambios sin sincronizar'
    }
  };

  const currentTheme = layoutMap[status];

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-md font-sans font-bold select-none transition-all duration-200 ${currentTheme.bg}`}>
      <span>{currentTheme.icon}</span>
      <span>{currentTheme.label}</span>
    </div>
  );
}