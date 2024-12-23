const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import routes
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/document'); // Import the document routes

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes); // Use the document routes

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});