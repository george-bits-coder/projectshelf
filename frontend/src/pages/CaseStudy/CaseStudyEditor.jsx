import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Grid,
  IconButton,
  Chip,
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { PhotoCamera, Add, Delete } from '@mui/icons-material';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { MediaUpload } from '../../components/case-study/MediaUpload';
import { TimelineEditor } from '../../components/case-study/TimeLineEditor';
import { TechnologySelector } from '../../components/case-study/TechnologySelector';
import { OutcomeEditor } from '../../components/case-study/OutcomeEditor';

const CaseStudySchema = Yup.object().shape({
  title: Yup.string().required('Required').max(100, 'Title too long'),
  slug: Yup.string()
    .required('Required')
    .matches(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),
  projectOverview: Yup.string().required('Required').max(2000, 'Too long'),
  featured: Yup.boolean(),
  published: Yup.boolean()
});

export const CaseStudyEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [feedback, setFeedback] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseFeedback = () => {
    setFeedback({ ...feedback, open: false });
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      slug: '',
      projectOverview: '',
      mediaGallery: [],
      timeline: [],
      technologies: [],
      outcomes: [],
      featured: false,
      published: false
    },
    validationSchema: CaseStudySchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('slug', values.slug);
        formData.append('projectOverview', values.projectOverview);
        formData.append('featured', values.featured);
        formData.append('published', values.published);
        formData.append('timeline', JSON.stringify(values.timeline));
        formData.append('technologies', JSON.stringify(values.technologies));
        formData.append('outcomes', JSON.stringify(values.outcomes));

        // Add media files to form data
        mediaFiles.forEach((file, index) => {
          if (file.file) {
            formData.append(`media-${index}`, file.file);
          }
          formData.append(`media-${index}-data`, JSON.stringify({
            type: file.type,
            caption: file.caption,
            order: file.order,
            url: file.url || '' // Include existing URL if available
          }));
        });

        let res;
        if (id) {
          res = await axios.put(`https://projectshelf-7g32.onrender.com/api/case-study/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setFeedback({
            open: true,
            message: 'Case study updated successfully!',
            severity: 'success'
          });
        } else {
          res = await axios.post('https://projectshelf-7g32.onrender.com/api/case-study', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setFeedback({
            open: true,
            message: 'Case study created successfully!',
            severity: 'success'
          });
        }

        // After successful save, navigate to the case study view
        setTimeout(() => {
          navigate(`/dashboard/case-studies/${res.data.data._id}`);
        }, 1000);
      } catch (err) {
        console.error(err);
        setFeedback({
          open: true,
          message: err.response?.data?.error || 'Failed to save case study. Please try again.',
          severity: 'error'
        });
      } finally {
        setIsSaving(false);
      }
    }
  });

  useEffect(() => {
    const fetchCaseStudy = async () => {
      if (id) {
        try {
          const res = await axios.get(`https://projectshelf-7g32.onrender.com/api/case-study/${id}`);
          formik.setValues({
            title: res.data.data.title,
            slug: res.data.data.slug,
            projectOverview: res.data.data.projectOverview,
            mediaGallery: res.data.data.mediaGallery || [],
            timeline: res.data.data.timeline || [],
            technologies: res.data.data.technologies || [],
            outcomes: res.data.data.outcomes || [],
            featured: res.data.data.featured,
            published: res.data.data.published
          });
          
          // Initialize media files with proper structure
          if (res.data.data.mediaGallery && res.data.data.mediaGallery.length > 0) {
            setMediaFiles(res.data.data.mediaGallery.map(item => ({
              ...item,
              preview: item.url
            })));
          }
        } catch (err) {
          console.error(err);
          setFeedback({
            open: true,
            message: err.response?.data?.error || 'Failed to load case study. Please try again.',
            severity: 'error'
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchCaseStudy();
  }, [id]);

  const handleAddTimelineItem = () => {
    formik.setFieldValue('timeline', [
      ...formik.values.timeline,
      {
        title: '',
        description: '',
        date: new Date(),
        order: formik.values.timeline.length
      }
    ]);
  };

  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...formik.values.timeline];
    newTimeline[index][field] = value;
    formik.setFieldValue('timeline', newTimeline);
  };

  const handleRemoveTimelineItem = (index) => {
    const newTimeline = [...formik.values.timeline];
    newTimeline.splice(index, 1);
    formik.setFieldValue('timeline', newTimeline);
  };

  const handleAddTechnology = (tech) => {
    formik.setFieldValue('technologies', [...formik.values.technologies, tech]);
  };

  const handleRemoveTechnology = (index) => {
    const newTechs = [...formik.values.technologies];
    newTechs.splice(index, 1);
    formik.setFieldValue('technologies', newTechs);
  };

  const handleAddOutcome = (outcome) => {
    formik.setFieldValue('outcomes', [...formik.values.outcomes, outcome]);
  };

  const handleRemoveOutcome = (index) => {
    const newOutcomes = [...formik.values.outcomes];
    newOutcomes.splice(index, 1);
    formik.setFieldValue('outcomes', newOutcomes);
  };

  const handleMediaUpload = (files) => {
    const newMedia = files.map(file => ({
      file,
      type: 'image',
      caption: '',
      order: mediaFiles.length,
      preview: URL.createObjectURL(file)
    }));
    setMediaFiles([...mediaFiles, ...newMedia]);
  };

  const handleRemoveMedia = (index) => {
    const newMedia = [...mediaFiles];
    newMedia.splice(index, 1);
    setMediaFiles(newMedia);
  };

  const handleMediaChange = (index, field, value) => {
    const newMedia = [...mediaFiles];
    newMedia[index][field] = value;
    setMediaFiles(newMedia);
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
      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={handleCloseFeedback}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseFeedback} severity={feedback.severity} sx={{ width: '100%' }}>
          {feedback.message}
        </Alert>
      </Snackbar>
      
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Edit Case Study' : 'Create New Case Study'}
        </Typography>
        
        <Paper sx={{ p: 3, mt: 2 }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="slug"
                  name="slug"
                  label="Slug"
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  error={formik.touched.slug && Boolean(formik.errors.slug)}
                  helperText={(formik.touched.slug && formik.errors.slug) || 'Used for URL, e.g. my-project-name'}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Project Overview
                </Typography>
                <ReactQuill
                  theme="snow"
                  value={formik.values.projectOverview}
                  onChange={(value) => formik.setFieldValue('projectOverview', value)}
                  style={{ height: '300px', marginBottom: '50px' }}
                />
                {formik.touched.projectOverview && formik.errors.projectOverview && (
                  <Typography color="error" variant="caption">
                    {formik.errors.projectOverview}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Media Gallery
                </Typography>
                <MediaUpload
                  mediaFiles={mediaFiles}
                  onUpload={handleMediaUpload}
                  onRemove={handleRemoveMedia}
                  onChange={handleMediaChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Project Timeline
                </Typography>
                <TimelineEditor
                  items={formik.values.timeline}
                  onAdd={handleAddTimelineItem}
                  onChange={handleTimelineChange}
                  onRemove={handleRemoveTimelineItem}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Technologies Used
                </Typography>
                <TechnologySelector
                  technologies={formik.values.technologies}
                  onAdd={handleAddTechnology}
                  onRemove={handleRemoveTechnology}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Outcomes
                </Typography>
                <OutcomeEditor
                  outcomes={formik.values.outcomes}
                  onAdd={handleAddOutcome}
                  onRemove={handleRemoveOutcome}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.featured}
                      onChange={(e) =>
                        formik.setFieldValue('featured', e.target.checked)
                      }
                      name="featured"
                      color="primary"
                    />
                  }
                  label="Featured Project"
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
                  label="Publish Case Study"
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button 
                    type="button" 
                    variant="outlined" 
                    color="primary" 
                    sx={{ mr: 2 }}
                    onClick={() => navigate('/dashboard/case-studies')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={20} /> : null}
                  >
                    {isSaving ? 'Saving...' : 'Save Case Study'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </>
  );
};