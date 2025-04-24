import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Header } from '../public/Header';

export const DashboardLayout = ({ children, title }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          {children}
        </Container>
        
      </Box>
    </Box>
  );
};