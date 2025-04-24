import React from 'react';
import { Box, Container } from '@mui/material';

export const AuthLayout = ({ children }) => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 8
      }}>
        {children}
      </Box>
    </Container>
  );
};