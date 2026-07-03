export type EditableDishField = 'name' | 'cost' | 'prepTime';

export interface ActiveEditCell {
  id: string;
  field: EditableDishField;
}
