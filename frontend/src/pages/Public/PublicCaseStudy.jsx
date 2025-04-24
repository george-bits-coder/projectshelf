import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { PublicLayout } from '../../components/public/PublicLayout';

export const PublicCaseStudy = () => {
  const { username, slug } = useParams();

  return (
    <PublicLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h3">Case Study: {slug}</Typography>
        <Typography>Username: {username}</Typography>
      </Box>
    </PublicLayout>
  );
};