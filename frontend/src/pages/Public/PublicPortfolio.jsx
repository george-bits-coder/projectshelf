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
  Divider
} from '@mui/material';
import { PublicLayout } from '../../components/public/PublicLayout';

export const PublicPortfolio = () => {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [user, setUser] = useState(null);
  const [caseStudies, setCaseStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`/${username}`);
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
    return <div>Loading...</div>;
  }

  if (!portfolio) {
    return <div>Portfolio not found</div>;
  }

  return (
    <PublicLayout theme={portfolio.theme}>
      <Box sx={{ pt: 8, pb: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            src={portfolio.profilePicture}
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Typography variant="h3" component="h1" gutterBottom>
            {portfolio.displayName || user.name}
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            {portfolio.bio}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            {portfolio.socialLinks?.website && (
              <Button
                variant="outlined"
                href={portfolio.socialLinks.website}
                target="_blank"
              >
                Website
              </Button>
            )}
            {portfolio.socialLinks?.twitter && (
              <Button
                variant="outlined"
                href={`https://twitter.com/${portfolio.socialLinks.twitter}`}
                target="_blank"
              >
                Twitter
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Featured Work
      </Typography>

      <Grid container spacing={4}>
        {caseStudies
          .filter(cs => cs.featured)
          .map((caseStudy) => (
            <Grid item xs={12} md={6} key={caseStudy._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {caseStudy.mediaGallery?.[0] && (
                  <CardMedia
                    component="img"
                    image={caseStudy.mediaGallery[0].url}
                    alt={caseStudy.mediaGallery[0].caption}
                    height="200"
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {caseStudy.title}
                  </Typography>
                  <Typography paragraph>
                    {caseStudy.projectOverview.substring(0, 150)}...
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {caseStudy.technologies?.slice(0, 3).map((tech, index) => (
                      <Chip key={index} label={tech.name} size="small" />
                    ))}
                  </Box>
                  <Button
                    href={`/${username}/${caseStudy.slug}`}
                    size="small"
                    variant="contained"
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
          <Typography variant="h4" gutterBottom sx={{ mt: 8, mb: 4 }}>
            Other Projects
          </Typography>
          <Grid container spacing={4}>
            {caseStudies
              .filter(cs => !cs.featured)
              .map((caseStudy) => (
                <Grid item xs={12} sm={6} md={4} key={caseStudy._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h3">
                        {caseStudy.title}
                      </Typography>
                      <Typography paragraph>
                        {caseStudy.projectOverview.substring(0, 100)}...
                      </Typography>
                      <Button
                        href={`/${username}/${caseStudy.slug}`}
                        size="small"
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </>
      )}
    </PublicLayout>
  );
};