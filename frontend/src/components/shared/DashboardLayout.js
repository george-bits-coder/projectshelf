import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { Header } from '../public/Header';
import { Footer } from '../public/Footer';
export const DashboardLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
       <Header />
      <Box component="main" sx={{ mt: 3 }}>
        <Container maxWidth="xl">
          <Outlet /> {/* This renders the dashboard children */}
        </Container>
      </Box>
     
    </Box>
  );
};