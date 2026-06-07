import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/auth.js';
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Database Connection (Optional based on .env)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.log('No MONGODB_URI found, skipping database connection.');
}

// Start Server
app.listen(PORT, () => {
  console.log(`FindIt backend server running on port ${PORT}`);
});
