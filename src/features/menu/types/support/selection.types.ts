// Defines what columns are editable
export type EditableDishField = 'name' | 'priceCents' | 'prepTime';

// Current cell which is focused manual or automatically
export interface ActiveEditCell {
  id: string;
  field: EditableDishField;
}