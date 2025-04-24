import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h1" gutterBottom>404</Typography>
      <Typography variant="h4" gutterBottom>Page Not Found</Typography>
      <Button variant="contained" component={Link} to="/" sx={{ mt: 3 }}>
        Go to Home
      </Button>
    </Box>
  );
};