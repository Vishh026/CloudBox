const express = require('express');
const cors = require('cors');
const cokieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const app = express();

app.use(express.json());

app.use(cors({ credentials: true }));
app.use(cokieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api',authRoutes)


module.exports = app;