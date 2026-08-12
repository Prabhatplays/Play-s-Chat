require('dotenv').config();

const express = require('express');
const path = require('path');

const db = require('../src/config/db');
const authRoutes = require('../src/Routes/auth');
const profileRoutes = require('../src/Routes/profile');

const app = express();

app.use(express.json());

app.use('/profile', profileRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Public', 'index.html'));
});

// IMPORTANT: no app.listen() here. Vercel calls this exported app
// directly as a serverless function on every request.
module.exports = app;

// NOTE: Socket.io (require('../src/socket/chat')) is NOT included here.
// Serverless functions are stateless and short-lived, so they cannot
// hold persistent WebSocket connections. Real-time chat will not work
// on Vercel no matter how this file is configured. See the notes file
// for how to split this out to Render/Railway.