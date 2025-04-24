import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Switch,
  IconButton
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';

export const CaseStudyList = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const res = await axios.get('/api/case-study');
        setCaseStudies(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  const togglePublish = async (id, published) => {
    try {
      await axios.put(`/api/case-study/${id}/publish`, { published: !published });
      setCaseStudies(caseStudies.map(cs => 
        cs._id === id ? { ...cs, published: !published } : cs
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFeature = async (id, featured) => {
    try {
      await axios.put(`/api/case-study/${id}/feature`, { featured: !featured });
      setCaseStudies(caseStudies.map(cs => 
        cs._id === id ? { ...cs, featured: !featured } : cs
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/case-study/${id}`);
      setCaseStudies(caseStudies.filter(cs => cs._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
   <>
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/dashboard/case-studies/new')}
        >
          Create New Case Study
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Published</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {caseStudies.map((caseStudy) => (
              <TableRow key={caseStudy._id}>
                <TableCell>{caseStudy.title}</TableCell>
                <TableCell>
                  <Switch
                    checked={caseStudy.featured}
                    onChange={() => toggleFeature(caseStudy._id, caseStudy.featured)}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={caseStudy.published}
                    onChange={() => togglePublish(caseStudy._id, caseStudy.published)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/dashboard/case-studies/${caseStudy._id}`)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(caseStudy._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};