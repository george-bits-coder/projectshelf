import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

export const ThemeSelector = ({ selectedTheme, onThemeChange }) => {
  const themes = [
    { id: 'light', name: 'Light', bg: '#ffffff', text: '#121212' },
    { id: 'dark', name: 'Dark', bg: '#121212', text: '#ffffff' },
    { id: 'minimal', name: 'Minimal', bg: '#f5f5f5', text: '#333333' }
  ];

  return (
    <Box>
      <Grid container spacing={2}>
        {themes.map((theme) => (
          <Grid item xs={12} sm={4} key={theme.id}>
            <Paper
              elevation={selectedTheme === theme.id ? 4 : 1}
              onClick={() => onThemeChange(theme.id)}
              sx={{
                p: 2,
                cursor: 'pointer',
                bgcolor: theme.bg,
                color: theme.text,
                border: selectedTheme === theme.id ? '2px solid primary.main' : 'none'
              }}
            >
              <Typography variant="h6">{theme.name}</Typography>
              <Box sx={{ height: '100px', bgcolor: theme.bg }} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};