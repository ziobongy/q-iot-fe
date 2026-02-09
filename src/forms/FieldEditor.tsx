import type {FormField} from '../model/FormSchema';
import {isArrayField, isObjectField, isPrimitiveField} from '../model/FormSchema';
import {Box, Button, IconButton, List, ListItem, MenuItem, Select, Stack, TextField, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Props {
  field: FormField;
  depth?: number;
  onChange: (field: FormField) => void;
  onRemove: (id: string) => void;
  onAddChild: (parentId: string, child: FormField) => void;
  onAddArrayElement: (arrayId: string, element: FormField | string | number) => void;
}

export default function FieldEditor({field, depth = 0, onChange, onRemove, onAddChild, onAddArrayElement}: Props) {

  const paddingLeft = depth * 16;

  const onNameChange = (v: string) => {
    onChange({...field, name: v} as FormField);
  }

  const onTypeChange = (t: any) => {
    // replace field with new minimal type
    if (t === 'object') {
      onChange({id: field.id, name: field.name, type: 'object', children: []} as FormField);
      return;
    }
    if (t === 'array') {
      onChange({id: field.id, name: field.name, type: 'array', itemType: 'string', items: []} as FormField);
      return;
    }
    // primitive
    onChange({id: field.id, name: field.name, type: t, value: t === 'string' ? '' : 0} as FormField);
  }

  return (
    <Box sx={{pl: paddingLeft, borderLeft: '1px dashed #ddd', mb: 1, py: 1}}>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField size="small" value={field.name} onChange={e => onNameChange(e.target.value)} placeholder="field name" />
        <Select size="small" value={field.type} onChange={e => onTypeChange((e.target.value as any))}>
          <MenuItem value={'string'}>string</MenuItem>
          <MenuItem value={'number'}>number</MenuItem>
          <MenuItem value={'object'}>object</MenuItem>
          <MenuItem value={'array'}>array</MenuItem>
        </Select>
        <IconButton size="small" onClick={() => onRemove(field.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* details per type */}
      {isPrimitiveField(field) && (
        <Box sx={{mt:1}}>
          <TextField size="small" label="Value" value={(field as any).value ?? ''} onChange={e => onChange({...field, value: e.target.value} as FormField)} />
        </Box>
      )}

      {isObjectField(field) && (
        <Box sx={{mt:1}}>
          <Stack spacing={1}>
            <Typography variant="caption">Object children</Typography>
            <List>
              {field.children.map(child => (
                <ListItem key={child.id} sx={{pl: 0}}>
                  <FieldEditor
                    field={child}
                    depth={depth + 1}
                    onChange={(f) => onChange({...field, children: field.children.map(c => c.id === f.id ? f : c)})}
                    onRemove={(id) => onChange({...field, children: field.children.filter(c => c.id !== id)})}
                    onAddChild={onAddChild}
                    onAddArrayElement={onAddArrayElement}
                  />
                </ListItem>
              ))}
            </List>
            <Button size="small" onClick={() => onAddChild(field.id, {id: 'new_'+Date.now().toString(36), name: 'newField', type: 'string', value: ''} as FormField)} startIcon={<AddIcon />}>Add child</Button>
          </Stack>
        </Box>
      )}

      {isArrayField(field) && (
        <Box sx={{mt:1}}>
          <Stack spacing={1}>
            <Typography variant="caption">Array items (itemType: {(field as any).itemType})</Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={() => onAddArrayElement(field.id, (field as any).itemType === 'object' ? {id: 'new_'+Date.now().toString(36), name: 'item', type: 'object', children: []} as FormField : (field as any).itemType === 'string' ? '' : 0)} startIcon={<AddIcon />}>Add element</Button>
            </Stack>
            <List>
              {(field as any).items.map((it: any, idx: number) => (
                <ListItem key={idx} sx={{pl: 0}}>
                  {typeof it === 'object' ? (
                    <Box sx={{width: '100%'}}>
                      <FieldEditor key={(it as FormField).id} field={it as FormField} depth={depth + 1} onChange={(f) => {
                        const newItems = (field as any).items.map((x: any, i: number) => i === idx ? f : x);
                        onChange({...field, items: newItems} as FormField);
                      }} onRemove={() => {
                        const newItems = (field as any).items.filter((_: any, i: number) => i !== idx);
                        onChange({...field, items: newItems} as FormField);
                      }} onAddChild={onAddChild} onAddArrayElement={onAddArrayElement} />
                    </Box>
                  ) : (
                    // primitive
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField size="small" value={it as any} onChange={e => {
                        const newItems = (field as any).items.map((x: any, i: number) => i === idx ? e.target.value : x);
                        onChange({...field, items: newItems} as FormField);
                      }} />
                      <IconButton size="small" onClick={() => {
                        const newItems = (field as any).items.filter((_: any, i: number) => i !== idx);
                        onChange({...field, items: newItems} as FormField);
                      }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  )}
                </ListItem>
              ))}
            </List>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
