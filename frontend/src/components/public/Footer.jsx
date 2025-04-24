import React from 'react';
import { Box, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} ProjectShelf. All rights reserved.
      </Typography>
    </Box>
  );
};