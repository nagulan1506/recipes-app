require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const recipeRoutes = require('./routes/recipeRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Recipes API is running successfully',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Recipes API',
    version: '1.0.0',
    documentation: {
      baseUrl: `${req.protocol}://${req.get('host')}/api/v1`,
      endpoints: {
        recipes: {
          getAll: 'GET /recipes',
          getById: 'GET /recipes/:id',
          create: 'POST /recipes',
          update: 'PUT /recipes/:id',
          delete: 'DELETE /recipes/:id',
          getByCategory: 'GET /recipes/category/:category',
          getByDifficulty: 'GET /recipes/difficulty/:difficulty',
          addReview: 'POST /recipes/:id/reviews',
          getStats: 'GET /recipes/stats'
        }
      },
      queryParameters: {
        pagination: 'page, limit',
        filtering: 'category, difficulty, cuisine, minRating, maxCookingTime',
        sorting: 'sortBy, sortOrder',
        search: 'search'
      }
    }
  });
});

// Mount routes
app.use(`/api/${process.env.API_VERSION || 'v1'}/recipes`, recipeRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Recipes API',
    documentation: `/api`,
    health: `/api/health`,
    version: '1.0.0'
  });
});

// Error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`\n📝 Available endpoints:`);
  console.log(`   GET    /api/v1/recipes                    - Get all recipes`);
  console.log(`   POST   /api/v1/recipes                    - Create new recipe`);
  console.log(`   GET    /api/v1/recipes/:id                - Get recipe by ID`);
  console.log(`   PUT    /api/v1/recipes/:id                - Update recipe by ID`);
  console.log(`   DELETE /api/v1/recipes/:id                - Delete recipe by ID`);
  console.log(`   GET    /api/v1/recipes/category/:category - Get recipes by category`);
  console.log(`   GET    /api/v1/recipes/difficulty/:level  - Get recipes by difficulty`);
  console.log(`   POST   /api/v1/recipes/:id/reviews        - Add review to recipe`);
  console.log(`   GET    /api/v1/recipes/stats              - Get recipe statistics`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

module.exports = app;
