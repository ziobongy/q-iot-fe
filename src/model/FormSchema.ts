export type FieldType = 'string' | 'number' | 'object' | 'array';

export interface BaseField {
  id: string;
  name: string;
  type: FieldType;
  required?: boolean;
}

export interface PrimitiveField extends BaseField {
  type: 'string' | 'number';
  value?: string | number;
}

// Object field contains children fields
export interface ObjectField extends BaseField {
  type: 'object';
  children: FormField[];
}

// Array field stores itemType and items. If itemType === 'object' then items are FormField objects (each item is an object instance)
export interface ArrayField extends BaseField {
  type: 'array';
  itemType: 'string' | 'number' | 'object';
  items: Array<string | number | FormField>;
}

export type FormField = PrimitiveField | ObjectField | ArrayField;

// Utility guards
export const isObjectField = (f: FormField): f is ObjectField => f.type === 'object';
export const isArrayField = (f: FormField): f is ArrayField => f.type === 'array';
export const isPrimitiveField = (f: FormField): f is PrimitiveField => f.type === 'string' || f.type === 'number';
