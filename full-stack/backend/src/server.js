require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./middleware/logger'); // <-- YOUR CUSTOM LOGGER
const urlRoutes = require('./routes/url.routes');
const redirectRoutes = require('./routes/redirect.routes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(logger.requestLogger); // <-- Use your request logger middleware here

// --- Routes ---
// API routes for creating/getting stats
app.use('/shorturls', urlRoutes); 
// Root route for redirection must be last
app.use('/', redirectRoutes); 

// --- Error Handling ---
// Not found handler
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// General error handler
app.use((error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    logger.error(`${statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
    });
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    // Note: Using the logger instead of console.log
    logger.info(`Server running on port ${PORT}`);
});