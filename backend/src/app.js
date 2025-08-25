const express = require('express');
const cors = require('cors');
const cokieParser = require('cookie-parser');

const app = express();

app.use(express.json());

app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(cokieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


module.exports = app;