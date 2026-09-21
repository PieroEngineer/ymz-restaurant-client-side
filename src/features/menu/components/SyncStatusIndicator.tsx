import type { SyncStatusType } from '@/features/menu/types/support/syncStatus.types';

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
    Downloading: {
      bg: 'bg-blue-50 border-blue-200 text-blue-700 animate-pulse',
      icon: '⏳',
      label: 'Obteniendo menu...'
    },
    Uploading: {
      bg: 'bg-blue-50 border-blue-200 text-blue-700 animate-pulse',
      icon: '⏳',
      label: 'Sincronizando cambios...'
    },
    Unsynchronized: {
      bg: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: '🟠',
      label: 'Cambios pendientes a sincronizar'
    },
    Error: {
      bg: 'bg-red-50 border-red-200 text-red-700',
      icon: '🔴',
      label: 'Error al conectar con la nube'
    }
  };

  const currentTheme = layoutMap[status];

  return (
    <div className={`flex min-w-0 items-center justify-center gap-1.5 px-3 py-2 sm:py-1 border rounded-full text-sm lg:text-md font-sans font-bold select-none transition-all duration-200 ${currentTheme.bg}`}>
      <span className="shrink-0">{currentTheme.icon}</span>
      <span className="truncate">{currentTheme.label}</span>
    </div>
  );
}
