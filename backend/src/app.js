const express = require('express');
const cors = require('cors');
const cokieParser = require('cookie-parser');

const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth.routes');
const fileManager = require('./routes/fileManger.route')
const folderManger = require('./routes/folder.routes')


const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL, // frontend URL
  credentials: true,               // allow cookies if needed
}));

app.use(cokieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/auth',authRoutes)
app.use('/api/file',fileManager)
app.use('/api/folder',folderManger)

const os = require('os')
console.log("CPU Cores:", os.cpus().length);


app.use(helmet())
app.use(compression())
// make responses lighter & safer.
app.use(rateLimit({
  windows : 15 * 60* 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
}))


module.exports = app;