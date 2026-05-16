const dotenv = require('dotenv');
// ⚠️ MUST be called first before any other require() that reads process.env
dotenv.config();

// Force Node.js to use IPv4 over IPv6. Render free tier blocks outbound IPv6,
// causing Gmail SMTP (smtp.gmail.com) to fail with ENETUNREACH.
require('dns').setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const channelRoutes = require('./routes/channelRoutes');
const videoRoutes = require('./routes/videoRoutes');
const commentRoutes = require('./routes/commentRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const historyRoutes = require('./routes/historyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const earningsRoutes = require('./routes/earningsRoutes');
const referralRoutes = require('./routes/referralRoutes');
const adminRoutes = require('./routes/adminRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const boostRoutes = require('./routes/boostRoutes');
const payoutRoutes = require('./routes/payoutRoutes');

// Connect to database
connectDB();

const app = express();

// Trust Render's reverse proxy — required for express-rate-limit to work correctly
// Without this, express-rate-limit throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
app.set('trust proxy', 1);

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Detailed Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (req.method !== 'GET' && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/channel', channelRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/subscribe', subscriptionRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/creator', creatorRoutes);
app.use('/api/boost', boostRoutes);
app.use('/api/payout', payoutRoutes);

// Initialize background jobs
const initCronJobs = require('./jobs/cronJobs');
const keepAlive = require('./jobs/keepAlive');
initCronJobs();
keepAlive(process.env.BACKEND_URL);

// Root route
app.get('/', (req, res) => {
  res.send('Video Platform API is running...');
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
