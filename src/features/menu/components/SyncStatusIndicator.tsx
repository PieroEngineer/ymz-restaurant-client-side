import type { MenuSyncStatus } from '@/features/menu/types/sync.types';

interface SyncStatusIndicatorProps {
  status: MenuSyncStatus;
}

const syncStatusView: Record<MenuSyncStatus, { label: string; className: string }> = {
  synchronized: {
    label: 'Sincronizado',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  loading: {
    label: 'Cargando',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  unsynchronized: {
    label: 'Sin sincronizar',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

export function SyncStatusIndicator({ status }: SyncStatusIndicatorProps) {
  const view = syncStatusView[status];

  return (
    <span
      className={`inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-bold uppercase ${view.className}`}
    >
      {view.label}
    </span>
  );
}
