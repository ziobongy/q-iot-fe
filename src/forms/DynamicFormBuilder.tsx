import {useState} from 'react';
import {Box, Button, Container, Paper, Stack, Typography} from '@mui/material';
import FieldEditor from './FieldEditor';
import type {FormField} from '../model/FormSchema';
import {createArrayField, createObjectField, createPrimitiveField, addField, updateField, removeField, addArrayElement} from './formHelpers';

export default function DynamicFormBuilder() {
  const [schema, setSchema] = useState<FormField[]>([]);

  const addRootPrimitive = (type: 'string' | 'number') => {
    setSchema(prev => addField(prev, null, createPrimitiveField('newField', type)));
  }
  const addRootObject = () => setSchema(prev => addField(prev, null, createObjectField('newObject')));
  const addRootArray = () => setSchema(prev => addField(prev, null, createArrayField('newArray', 'string')));

  const handleFieldChange = (f: FormField) => {
    setSchema(prev => updateField(prev, f.id, f));
  }

  const handleRemove = (id: string) => setSchema(prev => removeField(prev, id));
  const handleAddChild = (parentId: string, child: FormField) => {
    setSchema(prev => addField(prev, parentId, child));
  }

  const handleAddArrayElement = (arrayId: string, element: FormField | string | number) => {
    setSchema(prev => addArrayElement(prev, arrayId, element));
  }

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
            <Button variant="outlined" onClick={() => console.log(JSON.stringify(schema, null, 2))}>Log schema</Button>
          </Stack>

          <Box>
            {schema.map(f => (
              <FieldEditor key={f.id} field={f} onChange={handleFieldChange} onRemove={handleRemove} onAddChild={handleAddChild} onAddArrayElement={handleAddArrayElement} />
            ))}
          </Box>

          <Box>
            <Typography variant="subtitle2">Result JSON</Typography>
            <pre style={{maxHeight: 400, overflow: 'auto'}}>{JSON.stringify(schema, null, 2)}</pre>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
