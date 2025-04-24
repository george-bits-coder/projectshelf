import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  Avatar,
  IconButton
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { ThemeSelector } from '../../components/portfolio/ThemeSelector';
import { useAuth } from '../../contexts/AuthContext';

const PortfolioSchema = Yup.object().shape({
  displayName: Yup.string().required('Required'),
  bio: Yup.string().max(500, 'Bio cannot be more than 500 characters')
});

export const PortfolioEditor = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);

  const formik = useFormik({
    initialValues: {
      displayName: '',
      bio: '',
      socialLinks: {
        website: '',
        twitter: '',
        linkedin: '',
        github: '',
        dribbble: '',
        behance: ''
      },
      theme: 'minimal',
      published: false
    },
    validationSchema: PortfolioSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('displayName', values.displayName);
        formData.append('bio', values.bio);
        formData.append('socialLinks', JSON.stringify(values.socialLinks));
        formData.append('theme', values.theme);
        formData.append('published', values.published);
        
        if (profilePic) {
          formData.append('profilePicture', profilePic);
        }
        if (coverPic) {
          formData.append('coverImage', coverPic);
        }

        const res = await axios.post('/api/portfolio', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setPortfolio(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get('/api/portfolio');
        setPortfolio(res.data.data);
        formik.setValues({
          displayName: res.data.data.displayName || '',
          bio: res.data.data.bio || '',
          socialLinks: res.data.data.socialLinks || {
            website: '',
            twitter: '',
            linkedin: '',
            github: '',
            dribbble: '',
            behance: ''
          },
          theme: res.data.data.theme || 'minimal',
          published: res.data.data.published || false
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPortfolio();
    }
  }, [user]);

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleCoverPicChange = (e) => {
    setCoverPic(e.target.files[0]);
  };

  const handleThemeChange = (theme) => {
    formik.setFieldValue('theme', theme);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
   
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                src={profilePic ? URL.createObjectURL(profilePic) : portfolio?.profilePicture}
                sx={{ width: 80, height: 80, mr: 2 }}
              />
              <div>
                <Typography variant="h6">Profile Picture</Typography>
                <input
                  accept="image/*"
                  id="profile-pic"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleProfilePicChange}
                />
                <label htmlFor="profile-pic">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCamera />}
                  >
                    Upload
                  </Button>
                </label>
              </div>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box mb={2}>
              <Typography variant="h6">Cover Image</Typography>
              <input
                accept="image/*"
                id="cover-pic"
                type="file"
                style={{ display: 'none' }}
                onChange={handleCoverPicChange}
              />
              <label htmlFor="cover-pic">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                >
                  Upload Cover Image
                </Button>
              </label>
              {coverPic && (
                <Box mt={2}>
                  <img
                    src={URL.createObjectURL(coverPic)}
                    alt="Cover preview"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                  />
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="displayName"
              name="displayName"
              label="Display Name"
              value={formik.values.displayName}
              onChange={formik.handleChange}
              error={formik.touched.displayName && Boolean(formik.errors.displayName)}
              helperText={formik.touched.displayName && formik.errors.displayName}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              id="bio"
              name="bio"
              label="Bio"
              value={formik.values.bio}
              onChange={formik.handleChange}
              error={formik.touched.bio && Boolean(formik.errors.bio)}
              helperText={formik.touched.bio && formik.errors.bio}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="socialLinks.website"
              name="socialLinks.website"
              label="Website"
              value={formik.values.socialLinks.website}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="socialLinks.twitter"
              name="socialLinks.twitter"
              label="Twitter"
              value={formik.values.socialLinks.twitter}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Theme
            </Typography>
            <ThemeSelector
              selectedTheme={formik.values.theme}
              onThemeChange={handleThemeChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.published}
                  onChange={(e) =>
                    formik.setFieldValue('published', e.target.checked)
                  }
                  name="published"
                  color="primary"
                />
              }
              label="Publish Portfolio"
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
   
  );
};