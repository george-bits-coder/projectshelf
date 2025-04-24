import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

export const OutcomeEditor = ({ outcomes, onAdd, onRemove }) => {
  const [outcomeType, setOutcomeType] = useState('metric');
  const [outcomeData, setOutcomeData] = useState({});

  const handleAdd = () => {
    if (outcomeType === 'metric' && outcomeData.name && outcomeData.value) {
      onAdd({ type: 'metric', data: outcomeData });
      setOutcomeData({});
    } else if (outcomeType === 'testimonial' && outcomeData.text && outcomeData.author) {
      onAdd({ type: 'testimonial', data: outcomeData });
      setOutcomeData({});
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={outcomeType}
            label="Type"
            onChange={(e) => setOutcomeType(e.target.value)}
          >
            <MenuItem value="metric">Metric</MenuItem>
            <MenuItem value="testimonial">Testimonial</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add Outcome
        </Button>
      </Box>

      {outcomeType === 'metric' && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Metric Name"
            value={outcomeData.name || ''}
            onChange={(e) => setOutcomeData({ ...outcomeData, name: e.target.value })}
          />
          <TextField
            label="Value"
            value={outcomeData.value || ''}
            onChange={(e) => setOutcomeData({ ...outcomeData, value: e.target.value })}
          />
          <TextField
            label="Change"
            value={outcomeData.change || ''}
            onChange={(e) => setOutcomeData({ ...outcomeData, change: e.target.value })}
          />
        </Box>
      )}

      {outcomeType === 'testimonial' && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Testimonial Text"
            value={outcomeData.text || ''}
            onChange={(e) => setOutcomeData({ ...outcomeData, text: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Author"
            value={outcomeData.author || ''}
            onChange={(e) => setOutcomeData({ ...outcomeData, author: e.target.value })}
          />
        </Box>
      )}

      {outcomes.map((outcome, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" textTransform="capitalize">
              {outcome.type}
            </Typography>
            <Button
              size="small"
              startIcon={<Delete />}
              onClick={() => onRemove(index)}
            >
              Remove
            </Button>
          </Box>
          {outcome.type === 'metric' && (
            <Box>
              <Typography>{outcome.data.name}: {outcome.data.value}</Typography>
              {outcome.data.change && (
                <Typography variant="body2" color="text.secondary">
                  Change: {outcome.data.change}
                </Typography>
              )}
            </Box>
          )}
          {outcome.type === 'testimonial' && (
            <Box>
              <Typography fontStyle="italic">"{outcome.data.text}"</Typography>
              <Typography textAlign="right">- {outcome.data.author}</Typography>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};