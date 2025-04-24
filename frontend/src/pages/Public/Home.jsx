import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h2" gutterBottom>
        Welcome to ProjectShelf
      </Typography>
      <Typography variant="h5" gutterBottom>
        Create beautiful portfolios and showcase your work
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" size="large" component={Link} to="/auth/register">
          Get Started
        </Button>
      </Box>
    </Box>
  );
};