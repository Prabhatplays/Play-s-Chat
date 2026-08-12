require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const db = require('./src/config/db');
const authRoutes = require('./src/Routes/auth');
const profileRoutes = require('./src/Routes/profile');

app.use(express.json());

// Serve every file inside Public/ automatically —
// this is what makes /Signup.html, /Login.html, /chat.html,
// and any CSS/JS in that folder actually reachable.
app.use(express.static(path.join(__dirname, 'Public')));

app.use('/profile', profileRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

const server = http.createServer(app);
const io = new Server(server);

require('./src/socket/chat')(io);

server.listen(process.env.PORT || 3000, () => {
    console.log('Server running on Port', process.env.PORT || 3000);
});