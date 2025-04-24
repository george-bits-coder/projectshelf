import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';

export const DashboardHome = () => {
  return (
   
      <Box>
        <Typography variant="h5" gutterBottom>
          Welcome back!
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button variant="contained" href="/dashboard/portfolio">
            Edit Portfolio
          </Button>
          <Button variant="contained" href="/dashboard/case-studies">
            Manage Case Studies
          </Button>
          <Button variant="contained" href="/dashboard/analytics">
            View Analytics
          </Button>
        </Box>
      </Box>
    
  );
};