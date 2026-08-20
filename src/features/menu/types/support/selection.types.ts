// Defines what columns are editable
export type EditableDishFieldType = 'name' | 'priceCents' | 'prepTime' | 'isOutOfStock';

// Current cell which is focused manual or automatically
export interface ActiveEditCell {
  id: string;
  field: EditableDishFieldType;
}