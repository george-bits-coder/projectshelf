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
const path = require('path');
const app = express();
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
require('./config/db')();

// Middlewares
app.use(cors({
  origin: 'https://project-shelf.web.app', 
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


const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}
if (!fs.existsSync('./uploads/case-studies')) {
  fs.mkdirSync('./uploads/case-studies', { recursive: true });
}
// Routes

app.get('/hello', (req, res) => {
  res.status(200).json({ message: 'hello' });
});
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/case-study', caseStudyRoutes);
app.use('/api/analytics', analyticsRoutes);

// Public portfolio route
app.use('/', require('./routes/publicRoutes'));

// app.get("/hello",async(req,res)=>{

//   res.status(200).send({"message":"hi"})
// })

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
