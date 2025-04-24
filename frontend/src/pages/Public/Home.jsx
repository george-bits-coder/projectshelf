import {React,useEffect} from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyboardArrowRight } from '@mui/icons-material';


export const Home = () => {
  const features = [
    { title: "Portfolio Creation", description: "Build stunning project portfolios in minutes" },
    { title: "Easy Sharing", description: "Share your work with potential clients and employers" },
    { title: "Professional Templates", description: "Choose from beautiful pre-designed layouts" },
  ];
  useEffect(() => {
    // Call the hello API when component mounts
    const fetchHelloMessage = async () => {
      try {
        const response = await axios.get('https://projectshelf-7g32.onrender.com/hello');
        
      } catch (error) {
        console.error('Error fetching hello message:', error);
       
      }
    };

    fetchHelloMessage();
  }, []);
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      pt: 8,
      pb: 8
    }}>
      <Container>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            px: 2 
          }}>
            <Typography 
              variant="h1" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                mb: 2
              }}
            >
              ProjectShelf
            </Typography>
            <Typography 
              variant="h5" 
              component="h2"
              sx={{ 
                fontWeight: 400,
                color: '#546e7a',
                maxWidth: '800px',
                mx: 'auto',
                mb: 4
              }}
            >
              Showcase your work with stunning portfolios that leave a lasting impression
            </Typography>
            
            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button 
                component={Link} 
                to="/auth/register"
                variant="contained" 
                size="large"
                endIcon={<KeyboardArrowRight />}
                sx={{
                  borderRadius: '30px',
                  padding: '12px 30px',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1e88e5 30%, #00b0ff 90%)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s'
                  }
                }}
              >
                Get Started
              </Button>
              {/* <Button 
                component={Link} 
                to="/examples"
                variant="outlined" 
                size="large"
                sx={{
                  borderRadius: '30px',
                  padding: '12px 30px',
                  fontSize: '1.1rem',
                  borderColor: '#2196F3',
                  color: '#2196F3',
                  '&:hover': {
                    borderColor: '#1e88e5',
                    backgroundColor: 'rgba(33, 150, 243, 0.04)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s'
                  }
                }}
              >
                View Examples
              </Button> */}
            </Box>
          </Box>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper 
                  elevation={3}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: '16px',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px -10px rgba(33, 150, 243, 0.3)'
                    }
                  }}
                >
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      color: '#1976d2'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ color: '#546e7a' }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </motion.div>
        
        {/* Call to action section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Paper
            elevation={4}
            sx={{
              mt: 8,
              p: { xs: 4, md: 6 },
              borderRadius: '16px',
              background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.08) 0%, rgba(33, 203, 243, 0.15) 100%)',
              textAlign: 'center'
            }}
          >
            <Typography 
              variant="h4" 
              component="h3"
              sx={{ 
                fontWeight: 600,
                mb: 2,
                color: '#1565c0'
              }}
            >
              Ready to build your portfolio?
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                mb: 4,
                maxWidth: '700px',
                mx: 'auto',
                color: '#546e7a'
              }}
            >
              Join thousands of professionals who use ProjectShelf to showcase their work and
              attract new opportunities.
            </Typography>
            <Button 
              component={Link} 
              to="/auth/register"
              variant="contained" 
              size="large"
              sx={{
                borderRadius: '30px',
                padding: '12px 30px',
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #1565c0 30%, #0d47a1 90%)',
                boxShadow: '0 3px 5px 2px rgba(21, 101, 192, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0d47a1 30%, #1565c0 90%)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s'
                }
              }}
            >
              Start For Free
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};