import type { DishItem } from '@/features/menu/components/MenuDisplay';

export type MenuSyncStatus = 'synchronized' | 'loading' | 'unsynchronized';

export interface MenuPageItem {
  pageId: string;
  imageUrl: string;
}

export interface MenuSyncSource {
  menuPages: MenuPageItem[];
  dishes: DishItem[];
}

export interface SyncedMenuPage {
  pageId: string;
  pageNumber: number;
  imageUrl: string;
}

export interface SyncedDish {
  id: string;
  name: string;
  priceCents: number;
  prepTime: number;
  menuPageId: string;
  coordinateXInMenu: number;
  coordinateYInMenu: number;
  description: string;
}

export type MenuPageDiffItem =
  | {
      pageId: string;
      action: 'save';
      pageNumber: number;
      imageUrl: string;
    }
  | {
      id: string;
      action: 'update';
      updatedFields: Partial<Pick<SyncedMenuPage, 'pageNumber' | 'imageUrl'>>;
    }
  | {
      pageId: string;
      action: 'delete';
    };

export type DishDiffItem =
  | (SyncedDish & {
      action: 'save';
    })
  | {
      id: string;
      action: 'update';
      updatedFields: Partial<Omit<SyncedDish, 'id'>>;
    }
  | {
      id: string;
      action: 'delete';
    };

export interface MenuSyncDiff {
  menuPages: MenuPageDiffItem[];
  dishes: DishDiffItem[];
}

export interface MenuSyncSnapshot {
  menuPages: SyncedMenuPage[];
  dishes: SyncedDish[];
}
