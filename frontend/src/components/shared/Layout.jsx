import React from 'react';
import { Box } from '@mui/material';

export const Layout = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {children}
    </Box>
  );
};