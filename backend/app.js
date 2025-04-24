require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorMiddleware');
const cookieParser = require('cookie-parser');
// Import routes
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const caseStudyRoutes = require('./routes/caseStudyRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
app.use(cookieParser());
// Database connection
require('./config/db')();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/case-study', caseStudyRoutes);
app.use('/api/analytics', analyticsRoutes);

// Public portfolio route
app.use('/', require('./routes/publicRoutes'));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));