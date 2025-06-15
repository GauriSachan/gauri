import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';         // ✅ default import
import problemRoutes from './routes/problemRoutes.js';   // ✅ default import
import submissionRoutes from './routes/submissionRoutes.js'; // ✅ default import

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend port
  credentials: true
}));
app.use(express.json());

// Validate Mongo URI
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in .env');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Test Route
app.get('/', (req, res) => {
  res.send('🚀 Online Judge API is running');
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

