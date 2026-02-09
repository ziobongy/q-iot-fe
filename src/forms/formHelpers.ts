import type {FormField} from '../model/FormSchema';
import {isArrayField, isObjectField} from '../model/FormSchema';

// Simple id generator (avoids adding uuid dependency)
function genId() {
  return 'id_' + Math.random().toString(36).slice(2, 9);
}

export function createPrimitiveField(name: string, type: 'string' | 'number') : FormField {
  return {
    id: genId(),
    name,
    type,
    value: type === 'string' ? '' : 0,
  } as FormField;
}

export function createObjectField(name: string) : FormField {
  return {
    id: genId(),
    name,
    type: 'object',
    children: [],
  } as FormField;
}

export function createArrayField(name: string, itemType: 'string' | 'number' | 'object') : FormField {
  return {
    id: genId(),
    name,
    type: 'array',
    itemType,
    items: [],
  } as FormField;
}

// find field by id (returns parent and index for nested modifications)
export function findFieldById(schema: FormField[], id: string) : {field?: FormField, parent?: FormField | null, index?: number} {
  const stack: ({arr: FormField[], parent: FormField | null})[] = [{arr: schema, parent: null}];
  while (stack.length) {
    const {arr, parent} = stack.pop()!;
    for (let i = 0; i < arr.length; i++) {
      const f = arr[i];
      if (f.id === id) {
        return {field: f, parent, index: i};
      }
      if (isObjectField(f)) {
        stack.push({arr: f.children, parent: f});
      }
      if (isArrayField(f) && f.itemType === 'object') {
        for (const item of f.items) {
          if (typeof item === 'object') {
            // item is a FormField representing an object instance
            stack.push({arr: [item as FormField], parent: f});
          }
        }
      }
    }
  }
  return {};
}

// Generic immutable update helper — applies updater to array recursively
function updateInPlace(arr: FormField[], predicate: (f: FormField)=>boolean, updater: (f: FormField)=>FormField) : FormField[] {
  return arr.map(f => {
    if (predicate(f)) {
      return updater(f);
    }
    if (isObjectField(f)) {
      return {...f, children: updateInPlace(f.children, predicate, updater)} as FormField;
    }
    if (isArrayField(f) && f.itemType === 'object') {
      return {...f, items: f.items.map(item => typeof item === 'object' ? updaterInArray(item as FormField, predicate, updater) : item)} as FormField;
    }
    return f;
  });
}

function updaterInArray(item: FormField, predicate: (f: FormField)=>boolean, updater: (f: FormField)=>FormField) : FormField {
  if (predicate(item)) return updater(item);
  if (isObjectField(item)) {
    return {...item, children: updateInPlace(item.children, predicate, updater)} as FormField;
  }
  return item;
}

export function addField(schema: FormField[], parentId: string | null, field: FormField) : FormField[] {
  if (!parentId) {
    return [...schema, field];
  }
  // add to parent
  return updateInPlace(schema, f => f.id === parentId, f => {
    if (isObjectField(f)) {
      return {...f, children: [...f.children, field]} as FormField;
    }
    if (isArrayField(f) && f.itemType === 'object') {
      // push a new object instance for array items
      return {...f, items: [...f.items, field]} as FormField;
    }
    // invalid parent type: ignore
    return f;
  });
}

export function updateField(schema: FormField[], id: string, patch: Partial<FormField>) : FormField[] {
  return updateInPlace(schema, f => f.id === id, f => ({...f, ...patch} as FormField));
}

export function removeField(schema: FormField[], id: string) : FormField[] {
  function removeFrom(arr: FormField[]) : FormField[] {
    return arr.filter(f => f.id !== id).map(f => {
      if (isObjectField(f)) {
        return {...f, children: removeFrom(f.children)} as FormField;
      }
      if (isArrayField(f) && f.itemType === 'object') {
        return {...f, items: f.items.filter(it => !(typeof it === 'object' && (it as FormField).id === id)).map(it => typeof it === 'object' ? removeFrom([it as FormField])[0] : it)} as FormField;
      }
      return f;
    });
  }
  return removeFrom(schema);
}

export function addArrayElement(schema: FormField[], arrayFieldId: string, element: FormField | string | number) : FormField[] {
  return updateInPlace(schema, f => f.id === arrayFieldId, f => {
    if (isArrayField(f)) {
      return {...f, items: [...f.items, element]} as FormField;
    }
    return f;
  });
}

export function updateArrayElement(schema: FormField[], arrayFieldId: string, index: number, element: FormField | string | number) : FormField[] {
  return updateInPlace(schema, f => f.id === arrayFieldId, f => {
    if (isArrayField(f)) {
      const items = [...f.items];
      items[index] = element as any;
      return {...f, items} as FormField;
    }
    return f;
  });
}
