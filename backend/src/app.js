const express = require('express');
const cors = require('cors');
const cokieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const uploadRoute = require('./routes/upload.route')
const app = express();

app.use(express.json());

app.use(cors({ credentials: true }));
app.use(cokieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/auth',authRoutes)
app.use('/api/file',uploadRoute)

module.exports = app;