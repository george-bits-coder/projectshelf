import React from 'react';
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';

export const MediaUpload = ({ mediaFiles, onUpload, onRemove, onChange }) => {
  const handleFileChange = (e) => {
    onUpload(Array.from(e.target.files));
  };

  return (
    <Box>
      <input
        accept="image/*,video/*"
        id="media-upload"
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label htmlFor="media-upload">
        <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
          Upload Media
        </Button>
      </label>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {mediaFiles.map((file, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box sx={{ position: 'relative' }}>
              {file.type.includes('image') ? (
                <img
                  src={file.preview || file.url}
                  alt={file.caption}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              ) : (
                <video
                  src={file.preview || file.url}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  controls
                />
              )}
              <IconButton
                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
                onClick={() => onRemove(index)}
              >
                <Delete />
              </IconButton>
              <TextField
                fullWidth
                label="Caption"
                value={file.caption || ''}
                onChange={(e) => onChange(index, 'caption', e.target.value)}
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};