require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const db = require('./src/config/db');
const authRoutes = require('./src/Routes/auth');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));
app.use('/auth', authRoutes);

const server = http.createServer(app);
const io = new Server(server);

require('./src/socket/chat')(io);

server.listen(process.env.PORT || 3000, () => {
    console.log('Server running on Port 3000');
});