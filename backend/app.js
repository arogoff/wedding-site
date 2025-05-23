const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const personRoutes = require('./src/routes/personRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const registrationRoutes = require('./src/routes/rsvpRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging middleware

// Routes
app.use('/api/people', personRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rsvp', registrationRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('RSVP System API - Welcome!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;