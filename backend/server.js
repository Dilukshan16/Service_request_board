require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jobRoutes = require('./routes/jobs');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/globaltna')
  .then(() => {
    console.log('Connected to MongoDB');
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
