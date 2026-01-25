require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/error.middleware');
const requestLogger = require('./middleware/logger.middleware');

const authRoutes = require('./routes/auth.routes');
const proposalsRoutes = require('./routes/proposals.routes');
const feedbackRoutes = require('./routes/feedback.routes');
const commentsRoutes = require('./routes/comments.routes');
const votesRoutes = require('./routes/votes.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const searchRoutes = require('./routes/search.routes');
const aiRoutes = require('./routes/ai.routes');
const uploadRoutes = require('./routes/upload.routes');
const adminRoutes = require('./routes/admin.routes');

connectDB();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/votes', votesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

app.use(errorHandler);

module.exports = app;
