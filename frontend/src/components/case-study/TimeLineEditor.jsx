import React from 'react';
import { Box, Button, TextField, Typography, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

export const TimelineEditor = ({ items, onAdd, onChange, onRemove }) => {
  return (
    <Box>
      {items.map((item, index) => (
        <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle1">Timeline Item {index + 1}</Typography>
            <IconButton onClick={() => onRemove(index)}>
              <Delete />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label="Title"
            value={item.title}
            onChange={(e) => onChange(index, 'title', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={item.description}
            onChange={(e) => onChange(index, 'description', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={item.date}
            onChange={(e) => onChange(index, 'date', e.target.value)}
          />
        </Box>
      ))}
      <Button variant="outlined" onClick={onAdd}>
        Add Timeline Item
      </Button>
    </Box>
  );
};