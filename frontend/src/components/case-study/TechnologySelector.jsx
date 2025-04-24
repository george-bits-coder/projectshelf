import React, { useState } from 'react';
import { Box, Button, Chip, TextField, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';

export const TechnologySelector = ({ technologies, onAdd, onRemove }) => {
  const [techName, setTechName] = useState('');

  const handleAdd = () => {
    if (techName.trim()) {
      onAdd({ name: techName.trim() });
      setTechName('');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Technology Name"
          value={techName}
          onChange={(e) => setTechName(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {technologies.map((tech, index) => (
          <Chip
            key={index}
            label={tech.name}
            onDelete={() => onRemove(index)}
          />
        ))}
      </Box>
    </Box>
  );
};