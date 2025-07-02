// ✅ server/index.js (Final)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './auth.js';
import transactionRoutes from './transactions.js';
import goalsRoutes from './goals.js';
import badgesRoutes from './badges.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/badges', badgesRoutes);

// MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartpocket';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ MongoDB error:'));
db.once('open', () => console.log('✅ Connected to MongoDB'));

// Default route
app.get('/', (req, res) => {
  res.send('SmartPocket backend is running');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
