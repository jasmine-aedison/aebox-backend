const express = require('express');
const userRoutes = require('./routes/userRoutes');
const spaceRoutes = require('./routes/spaceRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const subscriptionController = require('./controllers/subscriptionController')
const deviceSyncRoutes = require('./routes/deviceSyncRoutes');
const { swaggerUi, swaggerDocs } = require('./swagger/swagger');
const subscriptionRoutes = require ("./routes/subscriptionRoutes")
const app = express();
const cors = require("cors");
const openaiRoutes = require("./routes/openaiRoutes");
const bodyParser = require("body-parser");
// app.post(
//   '/api/subscription/webhook',
//   express.raw({ type: 'application/json' }), // this keeps the body as a Buffer
//   subscriptionController.handleStripeWebhook
// );

app.post(
  '/api/subscription/webhook',
  express.raw({ type: 'application/json' }), // Keeps the body as a Buffer for Stripe signature validation
  (req, res, next) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      console.error("❌ Missing stripe-signature header!");
      return res.status(400).send("Missing stripe-signature header.");
    }
    next();
  },
  subscriptionController.handleStripeWebhook
);

// app.post('api/subscription/webhook', express.raw({ type: 'application/json' }), subscriptionController.handleStripeWebhook);

// Middleware
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({limit: '2mb', extended: true}));
// ✅ Stripe webhook - must come BEFORE express.json()

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ✅ Root and Health Routes (for uptime monitoring)
app.get('/', (req, res) => {
  res.send('AEBox backend is up and running');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://aebox-website.vercel.app', // Production frontend URL
      'http://localhost:3000',  
      'https://aebox.vercel.app',
      'http://localhost:3001',  
      'http://localhost:5173',  // Local development frontend URL
      'app://.', 'file://',
      "https://www.aeedison.com",
      "https://aeedison.com",
      'https://version.aeedison.com'
    ];
    if (allowedOrigins.includes(origin) || !origin) {
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
app.use('/api/subscription', subscriptionRoutes)
app.use("/api/openai", openaiRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
