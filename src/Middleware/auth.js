const auth = require('../middleware/auth');

routes.post('/upload', auth , upload.single('Profile_image', (req, res)=>{
    console.log(req.user.username);
}))

