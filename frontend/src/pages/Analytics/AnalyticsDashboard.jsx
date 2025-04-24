import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Tabs, Tab, Paper, Grid } from '@mui/material';
import { LineChart } from '../../components/analytics/LineChart';
import { PieChart } from '../../components/analytics/PieChart';
import { StatsCard } from '../../components/analytics/StatsCard';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const AnalyticsDashboard = () => {
  const [value, setValue] = useState(0);
  const [portfolioStats, setPortfolioStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/analytics/portfolio');
        setPortfolioStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
   
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="analytics tabs">
            <Tab label="Overview" />
            <Tab label="Case Studies" />
            <Tab label="Visitors" />
          </Tabs>
        </Box>
        
        <TabPanel value={value} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StatsCard
                title="Total Views"
                value={portfolioStats?.summary?.totalViews || 0}
                change="+12%"
                icon="visibility"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatsCard
                title="Unique Visitors"
                value={portfolioStats?.summary?.uniqueVisitors || 0}
                change="+8%"
                icon="people"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatsCard
                title="Avg. Time Spent"
                value={`${portfolioStats?.summary?.avgTimeSpent || 0}s`}
                change="+5%"
                icon="timer"
              />
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Views Over Time
                </Typography>
                <LineChart data={portfolioStats?.viewsData || []} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Top Case Studies
                </Typography>
                <PieChart data={portfolioStats?.topCaseStudies || []} />
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1}>
          {/* Case study specific analytics would go here */}
        </TabPanel>

        <TabPanel value={value} index={2}>
          {/* Visitor demographics would go here */}
        </TabPanel>
      </Box>
   
  );
};