const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../config/upload');
const db = require('../config/db');

router.get('/me', auth, (req, res) => {
    const username = req.user.username;
    db.query(
        'SELECT username, profile_pic FROM users WHERE username = ?',
        [username],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Something went wrong' });
            }
            res.status(200).json(results[0]);
        }
    );
});

router.post('/upload', auth, upload.single('profile_pic'), (req, res) => {
    const username = req.user.username;
    const filename = req.file.filename;
    const filePath = '/uploads/' + filename;

    db.query(
        'UPDATE users SET profile_pic = ? WHERE username = ?',
        [filePath, username],
        (err) => {
            if (err) {
                return res.status(500).json({ message: 'Something went wrong' });
            }
            res.status(200).json({
                message: 'Profile picture updated!',
                profile_pic: filePath
            });
        }
    );
});

module.exports = router;