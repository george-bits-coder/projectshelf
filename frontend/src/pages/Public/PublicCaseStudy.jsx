import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Divider,
  Container,
  Paper,
  IconButton,
  useTheme,
  Stack,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack,
  GitHub,
  Language,
  CalendarToday,
  Code,
  CheckCircle,
  Image as ImageIcon,
  VideoLibrary
} from '@mui/icons-material';
import { PublicLayout } from '../../components/public/PublicLayout';
import { useNavigate } from 'react-router-dom';

export const PublicCaseStudy = () => {
  const { username, slug } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        const res = await axios.get(`https://projectshelf-7g32.onrender.com/${username}/${slug}`);
        setCaseStudy(res.data.data.caseStudy);
        setPortfolio(res.data.data.portfolio);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to load case study');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseStudy();
  }, [username, slug]);

  if (isLoading) {
    return (
      <PublicLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
            Back to Portfolio
          </Button>
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="rectangular" height={400} sx={{ mb: 3 }} />
            <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={30} />
          </Box>
        </Container>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <Container maxWidth="md" sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h4" color="error" gutterBottom>
            Case Study Not Found
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
          >
            Back to Portfolio
          </Button>
        </Container>
      </PublicLayout>
    );
  }

  if (!caseStudy) {
    return null;
  }

  return (
    <PublicLayout theme={portfolio?.theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back to Portfolio
        </Button>

        {/* Hero Section */}
        <Paper
          elevation={3}
          sx={{
            mb: 6,
            overflow: 'hidden',
            borderRadius: 2,
            position: 'relative'
          }}
        >
          {caseStudy.mediaGallery?.[0] && (
            <CardMedia
              component="img"
              image={caseStudy.mediaGallery[0].url}
              alt={caseStudy.mediaGallery[0].caption || caseStudy.title}
              height="500"
              sx={{
                objectFit: 'cover',
                width: '100%'
              }}
            />
          )}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 4,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)'
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              {caseStudy.title}
            </Typography>
            {caseStudy.timeline?.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CalendarToday sx={{ color: 'white', mr: 1 }} />
                <Typography variant="subtitle1" sx={{ color: 'white' }}>
                  {caseStudy.timeline[0].date} - {caseStudy.timeline[caseStudy.timeline.length - 1].date}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={8}>
            {/* Project Overview */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Project Overview
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                {caseStudy.projectOverview}
              </Typography>
            </Box>

            {/* Timeline */}
            {caseStudy.timeline?.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Project Timeline
                </Typography>
                <List>
                  {caseStudy.timeline.map((item, index) => (
                    <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ minWidth: 40, pt: 1 }}>
                        <CalendarToday color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.date}
                        secondary={item.description}
                        primaryTypographyProps={{ fontWeight: 600 }}
                        secondaryTypographyProps={{ variant: 'body1' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Media Gallery */}
            {caseStudy.mediaGallery?.length > 1 && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Gallery
                </Typography>
                <Grid container spacing={3}>
                  {caseStudy.mediaGallery.slice(1).map((media, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card>
                        <CardMedia
                          component="img"
                          image={media.url}
                          alt={media.caption || `${caseStudy.title} - Image ${index + 1}`}
                          height="240"
                          sx={{ objectFit: 'cover' }}
                        />
                        {media.caption && (
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">
                              {media.caption}
                            </Typography>
                          </CardContent>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Project Details Sidebar */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Project Details
              </Typography>

              {/* Technologies */}
              {caseStudy.technologies?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Code sx={{ mr: 1 }} /> Technologies Used
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {caseStudy.technologies.map((tech, index) => (
                      <Chip
                        key={index}
                        label={tech.name}
                        variant="outlined"
                        color="primary"
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Outcomes */}
              {caseStudy.outcomes?.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle sx={{ mr: 1 }} /> Key Outcomes
                  </Typography>
                  <List dense>
                    {caseStudy.outcomes.map((outcome, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={outcome} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Project Links */}
              {(caseStudy.projectLink || caseStudy.githubRepo) && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Project Links
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {caseStudy.projectLink && (
                      <Button
                        variant="outlined"
                        startIcon={<Language />}
                        href={caseStudy.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                      >
                        Live Demo
                      </Button>
                    )}
                    {caseStudy.githubRepo && (
                      <Button
                        variant="outlined"
                        startIcon={<GitHub />}
                        href={caseStudy.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                      >
                        View Code
                      </Button>
                    )}
                  </Stack>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </PublicLayout>
  );
};