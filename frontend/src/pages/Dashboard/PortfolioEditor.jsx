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
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { ThemeSelector } from '../../components/portfolio/ThemeSelector';
import { useAuth } from '../../contexts/AuthContext';

// API base URL - better to use environment variable
const API_BASE_URL = 'http://localhost:5000/api';

const PortfolioSchema = Yup.object().shape({
  displayName: Yup.string().required('Required'),
  bio: Yup.string().max(500, 'Bio cannot be more than 500 characters')
});

export const PortfolioEditor = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [coverPicPreview, setCoverPicPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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
        setIsSubmitting(true);
        const formData = new FormData();
        
        // Append form fields to FormData
        formData.append('displayName', values.displayName);
        formData.append('bio', values.bio);
        formData.append('socialLinks', JSON.stringify(values.socialLinks));
        formData.append('theme', values.theme);
        formData.append('published', values.published.toString());
        
        if (profilePic) {
          formData.append('profilePicture', profilePic);
        }
        if (coverPic) {
          formData.append('coverImage', coverPic);
        }

        const res = await axios.post(`${API_BASE_URL}/portfolio`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true // Important for sending cookies/auth tokens
        });
        
        setPortfolio(res.data.data);
        setNotification({
          open: true,
          message: 'Portfolio successfully updated!',
          severity: 'success'
        });
      } catch (err) {
        console.error(err);
        setNotification({
          open: true,
          message: err.response?.data?.error || 'Failed to update portfolio',
          severity: 'error'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        console.log('Fetching portfolio data...');
        const res = await axios.get(`${API_BASE_URL}/portfolio`, {
          withCredentials: true // Important for sending cookies/auth tokens
        });
        
        console.log('Portfolio data received:', res.data);
        
        if (res.data.success && res.data.data) {
          const portfolioData = res.data.data;
          setPortfolio(portfolioData);
          
          // Set profile and cover image previews if they exist
          if (portfolioData.profilePicture) {
            setProfilePicPreview(portfolioData.profilePicture);
          }
          
          if (portfolioData.coverImage) {
            setCoverPicPreview(portfolioData.coverImage);
          }
          
          // Initialize form with existing data
          formik.resetForm({
            values: {
              displayName: portfolioData.displayName || '',
              bio: portfolioData.bio || '',
              socialLinks: portfolioData.socialLinks || {
                website: '',
                twitter: '',
                linkedin: '',
                github: '',
                dribbble: '',
                behance: ''
              },
              theme: portfolioData.theme || 'minimal',
              published: portfolioData.published || false
            }
          });
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        // If it's a 404, that's ok - user just doesn't have a portfolio yet
        if (err.response?.status !== 404) {
          setNotification({
            open: true,
            message: 'Failed to load portfolio data',
            severity: 'error'
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPortfolio();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverPicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverPic(file);
      setCoverPicPreview(URL.createObjectURL(file));
    }
  };

  const handleThemeChange = (theme) => {
    formik.setFieldValue('theme', theme);
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                src={profilePicPreview}
                sx={{ width: 80, height: 80, mr: 2 }}
              />
              <div>
                <Typography variant="h6">Profile Picture</Typography>
                <Typography variant="body1" color="text.secondary">
                  Username: {user?.username}
                </Typography>
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
              {coverPicPreview && (
                <Box mt={2}>
                  <img
                    src={coverPicPreview}
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="socialLinks.linkedin"
              name="socialLinks.linkedin"
              label="LinkedIn"
              value={formik.values.socialLinks.linkedin}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="socialLinks.github"
              name="socialLinks.github"
              label="GitHub"
              value={formik.values.socialLinks.github}
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
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};