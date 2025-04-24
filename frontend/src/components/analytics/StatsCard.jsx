import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export const StatsCard = ({ title, value, change, icon }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {change} from last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};