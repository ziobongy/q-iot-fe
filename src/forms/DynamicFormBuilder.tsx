import {useState, useMemo, useEffect} from 'react';
import {Box, Button, Container, Paper, Stack, Typography} from '@mui/material';
import FieldEditor from './FieldEditor';
import {type FormField, isArrayField, isObjectField, isPrimitiveField} from '../model/FormSchema';
import {createArrayField, createObjectField, createPrimitiveField, addField, updateField, removeField, addArrayElement} from './formHelpers';

export default function DynamicFormBuilder({schema, onUpdate}:{schema?: FormField[], onUpdate?: (result: {schema: FormField[], jsonResult: any}) => void}) {
  const [formSchema, setFormSchema] = useState<FormField[]>([]);

  useEffect(() => {
    if (schema) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormSchema(schema);
    }
  }, [schema]);

  const addRootPrimitive = (type: 'string' | 'number') => {
    setFormSchema(prev => addField(prev, null, createPrimitiveField('newField', type)));
  }
  const addRootObject = () => setFormSchema(prev => addField(prev, null, createObjectField('newObject')));
  const addRootArray = () => setFormSchema(prev => addField(prev, null, createArrayField('newArray', 'string')));

  const handleFieldChange = (f: FormField) => {
    setFormSchema(prev => updateField(prev, f.id, f));
  }

  const handleRemove = (id: string) => setFormSchema(prev => removeField(prev, id));
  const handleAddChild = (parentId: string, child: FormField) => {
    setFormSchema(prev => addField(prev, parentId, child));
  }

  const handleAddArrayElement = (arrayId: string, element: FormField | string | number) => {
    setFormSchema(prev => addArrayElement(prev, arrayId, element));
  }

  // Converts the schema to runtime JSON data (name -> value). Returns an object for root-level fields
  const schemaToData = (schema: FormField[]) => {
    const result: Record<string, any> = {};
    const fieldToValue = (f: FormField): any => {
      if ((isPrimitiveField as any)(f)) {
        return (f as any).value ?? (f.type === 'number' ? 0 : '');
      }
      if ((isObjectField as any)(f)) {
        const obj: Record<string, any> = {};
        for (const child of (f as any).children) {
          obj[child.name] = fieldToValue(child);
        }
        return obj;
      }
      if ((isArrayField as any)(f)) {
        const arr: any[] = [];
        for (const it of (f as any).items) {
          if (typeof it === 'object') {
            arr.push(fieldToValue(it as FormField));
          } else {
            arr.push(it);
          }
        }
        return arr;
      }
      return null;
    }

    for (const f of schema) {
      result[f.name] = fieldToValue(f);
    }
    return result;
  }

  const previewData = useMemo(() => schemaToData(formSchema), [formSchema]);

  useEffect(() => {
    if(onUpdate) {
      onUpdate({
        schema: formSchema,
        jsonResult: schemaToData(formSchema)
      })
    }
  }, [formSchema]);

  return (
    <Container sx={{py: 2}}>
      <Paper sx={{p:2}}>
        <Stack spacing={2}>
          <Typography variant="h6">Dynamic Form Builder</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={() => addRootPrimitive('string')}>Add string</Button>
            <Button variant="contained" onClick={() => addRootPrimitive('number')}>Add number</Button>
            <Button variant="contained" onClick={addRootObject}>Add object</Button>
            <Button variant="contained" onClick={addRootArray}>Add array</Button>
            <Button variant="outlined" onClick={() => console.log(JSON.stringify(formSchema, null, 2))}>Log schema</Button>
          </Stack>

          <Box>
            {formSchema.map(f => (
              <FieldEditor key={f.id} field={f} onChange={handleFieldChange} onRemove={handleRemove} onAddChild={handleAddChild} onAddArrayElement={handleAddArrayElement} />
            ))}
          </Box>

          <Box>
            <Typography variant="subtitle2">Schema (internal)</Typography>
            <pre style={{maxHeight: 200, overflow: 'auto'}}>{JSON.stringify(formSchema, null, 2)}</pre>
          </Box>

          <Box>
            <Typography variant="subtitle2">Preview Data (runtime JSON)</Typography>
            <pre style={{maxHeight: 400, overflow: 'auto'}}>{JSON.stringify(previewData, null, 2)}</pre>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
