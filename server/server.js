// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // We'll create this next
const { initSupabase } = require('./config/supabaseClient'); // We'll create this
const { initGemini } = require('./config/gemini'); // We'll create this

// Load environment variables
dotenv.config();

// Initialize Database Connection
connectDB();

// Initialize Supabase (optional here, depends if needed globally immediately)
initSupabase();

// Initialize Gemini (optional here, if needed globally)
initGemini();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Basic Test Route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Resume Analyzer API!' });
});

// --- Authentication Routes (We'll add these soon) ---
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes'); // Add this
const jobRoutes = require('./routes/jobRoutes'); // Add this


app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes); // Add this line
app.use('/api/jobs', jobRoutes); // Add this line

// --- Other Routes (will be added later) ---
// app.use('/api/jobs', jobRoutes);
// app.use('/api/resumes', resumeRoutes);


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});