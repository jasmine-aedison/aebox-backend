const express = require('express');
const userRoutes = require('./routes/userRoutes');
const spaceRoutes = require('./routes/spaceRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const deviceSyncRoutes = require('./routes/deviceSyncRoutes');
const { swaggerUi, swaggerDocs } = require('./swagger/swagger');

const app = express();
const cors = require("cors");

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://aebox-website.vercel.app', // Production frontend URL
      'http://localhost:3000',  
               // Local development frontend URL
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      // Allow requests with no origin (e.g., mobile apps, Postman) or valid origin
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
// Apply CORS middleware with options
app.use(cors(corsOptions));
// Routes
app.use('/api/users', userRoutes); // Base path for user routes
app.use('/api/spaces', spaceRoutes); // Base path for space routes
app.use('/api/applications', applicationRoutes); // Base path for application routes
app.use('/api/sessions', sessionRoutes); // Base path for session routes
app.use('/api/devices', deviceSyncRoutes); // Base path for device sync routes

// Swagger UI endpoint

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
