const express = require('express');
const app = express();
const path = require('path');
const db = require('./src/config/db');
const authRoutes = require('./src/routes/auth')

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/auth', authRoutes)

app.listen(3000, () => {
    console.log('Server is running on Port 3000');
});
