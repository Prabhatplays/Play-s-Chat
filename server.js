require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const db = require('./src/config/db');
const authRoutes = require('./src/Routes/auth');
const profileRoutes = require('./src/Routes/profile');

app.use('/profile' , profileRoutes);
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});
app.use('/auth', authRoutes);

const server = http.createServer(app);
const io = new Server(server);

require('./src/socket/chat')(io);

server.listen(process.env.PORT || 3000, () => {
    console.log('Server running on Port 3000');
});