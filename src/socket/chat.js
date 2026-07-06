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

    // Load last 50 messages when user connects
    db.query(
      `SELECT messages.username, messages.text, messages.time, users.profile_pic 
       FROM messages 
       JOIN users ON messages.username = users.username 
       ORDER BY messages.time ASC 
       LIMIT 50`,
      (err, results) => {
        if (err) {
          console.log('Error loading messages', err);
          return;
        }
        socket.emit('load_messages', results);
      }
    );                              // ← closes load messages query

    // When user sends a message
    socket.on('send_message', (text) => {
      const username = socket.user.username;
      const time = new Date();

      // Step 1: get profile pic from DB
      db.query(
        'SELECT profile_pic FROM users WHERE username = ?',
        [username],
        (err, results) => {
          if (err) {
            console.log('Error fetching profile pic', err);
            return;
          }

          const profile_pic = results[0].profile_pic || '/uploads/default.png';

          // Step 2: save message to DB
          db.query(
            'INSERT INTO messages (username, text, time) VALUES (?, ?, ?)',
            [username, text, time],
            (err) => {
              if (err) {
                console.log('Error saving message', err);
                return;
              }

              // Step 3: broadcast to everyone WITH profile pic
              io.to('general').emit('receive_message', {
                username,
                text,
                time: time.toLocaleTimeString(),
                profile_pic    // ← added this!
              });
            }
          );                   // ← closes INSERT query
        }
      );                       // ← closes SELECT profile_pic query
    });                        // ← closes send_message event

    socket.on('disconnect', () => {
      console.log(`${socket.user.username} disconnected`);
    });
  });                          // ← closes connection event

};                             // ← closes module.exports