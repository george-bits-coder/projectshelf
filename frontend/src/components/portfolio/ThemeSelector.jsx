import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme
} from '@mui/material';
import { LightMode, DarkMode, Palette } from '@mui/icons-material';

const themes = [
  {
    id: 'minimal',
    name: 'Minimal',
    icon: Palette,
    description: 'Clean and minimal design'
  },
  {
    id: 'light',
    name: 'Light',
    icon: LightMode,
    description: 'Bright and modern feel'
  },
  {
    id: 'dark',
    name: 'Dark',
    icon: DarkMode,
    description: 'Elegant dark appearance'
  }
];

export const ThemeSelector = ({ selectedTheme, onThemeChange }) => {
  const theme = useTheme();

  const handleChange = (event) => {
    if (onThemeChange) {
      onThemeChange(event.target.value);
    }
  };

  return (
    <RadioGroup 
      name="theme-selector"
      value={selectedTheme}
      onChange={handleChange}
    >
      <Grid container spacing={2}>
        {themes.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedTheme === item.id;

          return (
            <Grid item xs={12} sm={4} key={item.id}>
              <FormControlLabel
                value={item.id}
                control={<Radio style={{ display: 'none' }} />}
                label=""
                sx={{ margin: 0, width: '100%' }}
              />
              <Card
                sx={{
                  height: '100%',
                  border: isSelected 
                    ? `2px solid ${theme.palette.primary.main}` 
                    : '2px solid transparent',
                  boxShadow: isSelected ? 3 : 1,
                  transition: 'all 0.3s ease',
                  opacity: isSelected ? 1 : 0.7
                }}
              >
                <CardActionArea
                  onClick={() => onThemeChange(item.id)}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 1
                      }}
                    >
                      <Icon 
                        color={isSelected ? "primary" : "action"} 
                        sx={{ mr: 1 }} 
                      />
                      <Typography 
                        variant="h6" 
                        color={isSelected ? "primary" : "textPrimary"}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </RadioGroup>
  );
};