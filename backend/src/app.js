const express = require('express');
const cors = require('cors');
const cokieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const fileManager = require('./routes/fileManger.route')
const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,               // allow cookies if needed
}));
app.use(cokieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/auth',authRoutes)
app.use('/api/file',fileManager)

module.exports = app;