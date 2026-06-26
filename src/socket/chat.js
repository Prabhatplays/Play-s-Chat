const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports = (io) => {

  // Security check
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('No token'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch (e) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`${socket.user.username} connected`);

    socket.join('general');

    // When user connects → load last 50 messages from DB and send to THEM ONLY
    db.query(
      'SELECT username, text, time FROM messages ORDER BY time ASC LIMIT 50',
      (err, results) => {
        if (err) {
          console.log('Error loading messages', err);
          return;
        }
        socket.emit('load_messages', results);
      }
    );

    // When user sends a message
    socket.on('send_message', (text) => {
      const username = socket.user.username;
      const time = new Date();

      // First save to database
      db.query(
        'INSERT INTO messages (username, text, time) VALUES (?, ?, ?)',
        [username, text, time],
        (err) => {
          if (err) {
            console.log('Error saving message', err);
            return;
          }
          // Then broadcast to everyone
          io.to('general').emit('receive_message', {
            username,
            text,
            time: time.toLocaleTimeString()
          });
        }
      );
    });

    socket.on('disconnect', () => {
      console.log(`${socket.user.username} disconnected`);
    });
  });

};