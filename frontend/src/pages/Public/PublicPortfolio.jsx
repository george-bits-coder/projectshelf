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
  Skeleton,
  Paper,
  IconButton,
  useTheme
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Twitter,
  Language,
  ArrowRightAlt,
  Star
} from '@mui/icons-material';
import { PublicLayout } from '../../components/public/PublicLayout';

export const PublicPortfolio = () => {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [user, setUser] = useState(null);
  const [caseStudies, setCaseStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`https://projectshelf-7g32.onrender.com/${username}`);
        setUser(res.data.data.user);
        setPortfolio(res.data.data.portfolio);
        setCaseStudies(res.data.data.caseStudies);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [username]);

  if (isLoading) {
    return (
      <PublicLayout>
        <Container maxWidth="lg">
          <Box sx={{ pt: 8, pb: 6, textAlign: 'center' }}>
            <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width="60%" height={60} sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="text" width="80%" height={40} sx={{ mx: 'auto' }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Skeleton variant="rectangular" width={100} height={40} />
              <Skeleton variant="rectangular" width={100} height={40} />
            </Box>
          </Box>
          <Divider sx={{ my: 4 }} />
          <Skeleton variant="text" width="30%" height={50} sx={{ mb: 4 }} />
          <Grid container spacing={4}>
            {[...Array(2)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Skeleton variant="rectangular" height={300} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </PublicLayout>
    );
  }

  if (!portfolio) {
    return (
      <PublicLayout>
        <Container maxWidth="md" sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h4" color="error" gutterBottom>
            Portfolio Not Found
          </Typography>
          <Typography variant="body1">
            The portfolio you're looking for doesn't exist or may have been removed.
          </Typography>
        </Container>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout theme={portfolio.theme}>
      <Box sx={{
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        pt: 8,
        pb: 6
      }}>
        <Container maxWidth="md">
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <Avatar
              src={portfolio.profilePicture}
              sx={{
                width: 150,
                height: 150,
                mb: 3,
                border: `4px solid ${theme.palette.primary.main}`,
                boxShadow: theme.shadows[4]
              }}
            />
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              {portfolio.displayName || user.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph sx={{ maxWidth: '80%' }}>
              {portfolio.bio}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              {portfolio.socialLinks?.website && (
                <IconButton
                  color="primary"
                  href={portfolio.socialLinks.website}
                  target="_blank"
                  sx={{ border: `1px solid ${theme.palette.divider}` }}
                >
                  <Language />
                </IconButton>
              )}
              {portfolio.socialLinks?.twitter && (
                <IconButton
                  color="primary"
                  href={`https://twitter.com/${portfolio.socialLinks.twitter}`}
                  target="_blank"
                  sx={{ border: `1px solid ${theme.palette.divider}` }}
                >
                  <Twitter />
                </IconButton>
              )}
              {portfolio.socialLinks?.github && (
                <IconButton
                  color="primary"
                  href={`https://github.com/${portfolio.socialLinks.github}`}
                  target="_blank"
                  sx={{ border: `1px solid ${theme.palette.divider}` }}
                >
                  <GitHub />
                </IconButton>
              )}
              {portfolio.socialLinks?.linkedin && (
                <IconButton
                  color="primary"
                  href={`https://linkedin.com/in/${portfolio.socialLinks.linkedin}`}
                  target="_blank"
                  sx={{ border: `1px solid ${theme.palette.divider}` }}
                >
                  <LinkedIn />
                </IconButton>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Star color="primary" sx={{ mr: 1 }} />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
            Featured Work
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {caseStudies
            .filter(cs => cs.featured)
            .map((caseStudy) => (
              <Grid item xs={12} md={6} key={caseStudy._id}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[6]
                  }
                }}>
                  {caseStudy.mediaGallery?.[0] && (
                    <CardMedia
                      component="img"
                      image={caseStudy.mediaGallery[0].url}
                      alt={caseStudy.mediaGallery[0].caption}
                      height="240"
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                      {caseStudy.title}
                    </Typography>
                    <Typography paragraph sx={{ mb: 2 }}>
                      {caseStudy.projectOverview.substring(0, 150)}...
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                      {caseStudy.technologies?.slice(0, 5).map((tech, index) => (
                        <Chip
                          key={index}
                          label={tech.name}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                    <Button
                      href={`/${username}/${caseStudy.slug}`}
                      variant="contained"
                      endIcon={<ArrowRightAlt />}
                      fullWidth
                    >
                      View Case Study
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {caseStudies.some(cs => !cs.featured) && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 8, mb: 4 }}>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                Other Projects
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {caseStudies
                .filter(cs => !cs.featured)
                .map((caseStudy) => (
                  <Grid item xs={12} sm={6} md={4} key={caseStudy._id}>
                    <Paper elevation={2} sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                          {caseStudy.title}
                        </Typography>
                        <Typography paragraph sx={{ mb: 2 }}>
                          {caseStudy.projectOverview.substring(0, 100)}...
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {caseStudy.technologies?.slice(0, 3).map((tech, index) => (
                            <Chip
                              key={index}
                              label={tech.name}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                        <Button
                          href={`/${username}/${caseStudy.slug}`}
                          size="small"
                          endIcon={<ArrowRightAlt />}
                          fullWidth
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          </>
        )}
      </Container>

      <Box sx={{ bgcolor: 'background.paper', py: 6, mt: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Let's Work Together
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Interested in collaborating or have a project in mind?
          </Typography>
          <Button
            variant="contained"
            size="large"
            href={portfolio.contactEmail ? `mailto:${portfolio.contactEmail}` : '#'}
            sx={{ px: 4 }}
          >
            Get In Touch
          </Button>
        </Container>
      </Box>
    </PublicLayout>
  );
};