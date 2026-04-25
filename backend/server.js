const express = require('express');
const dotenv = require('dotenv');
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

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
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
