const path = require('path');  //production addition
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
//app.use(cors({ origin: 'http://localhost:5173' }));  --> development
app.use(cors({
  origin:
    process.env.NODE_ENV === 'production'   //production addition
      ? true
      : 'http://localhost:5173'
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Import routes
const validateRoute = require('./routes/validate');
const explainRoute = require('./routes/explain');  
const contextRoute = require('./routes/context');
const crossrefRoute = require('./routes/crossref');
const youtubeRoute = require('./routes/youtube');
const translateRoute = require('./routes/translate');

// Register routes
app.use('/api', validateRoute);
app.use('/api', explainRoute);  
app.use('/api', contextRoute);
app.use('/api', crossrefRoute);
app.use('/api', youtubeRoute);
app.use('/api', translateRoute);

//production addition
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(
    path.join(__dirname, '../frontend/dist') //production addition
  ));
 
  app.get('*', (req, res) => {
    res.sendFile(
      path.join(__dirname, '../frontend/dist/index.html')
    );
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔑 OpenAI Key configured: ${!!process.env.OPENAI_API_KEY}`);
});