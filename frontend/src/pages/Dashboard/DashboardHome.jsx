import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Divider,
  useTheme
} from '@mui/material';
import { 
  DashboardCustomize as PortfolioIcon,
  AutoStories as CaseStudiesIcon,
  BarChart as AnalyticsIcon,
  AutoAwesome as NewIcon
} from '@mui/icons-material';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';

export const DashboardHome = () => {
  const theme = useTheme();
  
  // Sample metrics - in a real app, these would come from your API/backend
  const portfolioMetrics = {
    views: 428,
    projectsCount: 6,
    latestUpdate: '2 days ago',
    feedback: 15
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.light}10)`,
          border: `1px solid ${theme.palette.primary.main}20`
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back to your creative workspace!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Showcase your work, tell your story, and track your impact. What would you like to work on today?
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<NewIcon />}
              sx={{ 
                px: 3, 
                py: 1.5, 
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)'
              }}
              href="/dashboard/case-studies/new"
            >
              Create New Case Study
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Portfolio Performance</Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Total Views</Typography>
                  <Typography variant="h6" fontWeight="bold">{portfolioMetrics.views}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Projects</Typography>
                  <Typography variant="h6" fontWeight="bold">{portfolioMetrics.projectsCount}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="h6" fontWeight="bold">{portfolioMetrics.latestUpdate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Feedback</Typography>
                  <Typography variant="h6" fontWeight="bold">{portfolioMetrics.feedback}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Actions Cards */}
      <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {/* Portfolio Builder Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: theme.palette.primary.main + '15', 
                  borderRadius: '50%', 
                  p: 1,
                  mr: 2
                }}>
                  <PortfolioIcon color="primary" />
                </Box>
                <Typography variant="h6">Portfolio Builder</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Customize your portfolio layout, themes, and content organization. Make your work shine!
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button 
                variant="outlined" 
                fullWidth 
                href="/dashboard/portfolio"
                sx={{ borderRadius: 1.5 }}
              >
                Edit Portfolio
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Case Studies Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: theme.palette.secondary.main + '15', 
                  borderRadius: '50%', 
                  p: 1,
                  mr: 2
                }}>
                  <CaseStudiesIcon color="secondary" />
                </Box>
                <Typography variant="h6">Case Studies</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Create, edit, and organize your case studies. Show your process and highlight outcomes.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button 
                variant="outlined" 
                fullWidth 
                href="/dashboard/case-studies"
                sx={{ borderRadius: 1.5 }}
              >
                Manage Case Studies
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Analytics Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: '#FF8A65' + '15', 
                  borderRadius: '50%', 
                  p: 1,
                  mr: 2
                }}>
                  <AnalyticsIcon sx={{ color: '#FF8A65' }} />
                </Box>
                <Typography variant="h6">Analytics</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Track portfolio performance, visitor engagement, and case study popularity metrics.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button 
                variant="outlined" 
                fullWidth 
                href="/dashboard/analytics"
                sx={{ borderRadius: 1.5 }}
              >
                View Analytics
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};