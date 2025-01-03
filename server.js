const express = require('express');
const userRoutes = require('./routes/userRoutes');
const spaceRoutes = require('./routes/spaceRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const deviceSyncRoutes = require('./routes/deviceSyncRoutes');
const { swaggerUi, swaggerDocs } = require('./swagger/swagger');

const app = express();

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


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
