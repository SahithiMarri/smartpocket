import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './auth.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartpocket';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('SmartPocket backend is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
