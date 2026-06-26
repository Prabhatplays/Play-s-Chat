const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, req.body.username + '_' + Date.now() + ext);
    }
});

const upload = multer({ storage: storage });
module.exports = upload;