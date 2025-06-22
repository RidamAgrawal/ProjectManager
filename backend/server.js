const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser=require('cookie-parser');
const dbConnect = require('./dbCon/dbCon');

require('dotenv').config();

const app = express();

dbConnect();


const allowedOrigins = [
  'http://localhost:4200',                     // for local dev
  'https://project-manager-beta-five.vercel.app',         // your Vercel domain
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed from this origin: ' + origin), false);
    }
  },
  credentials: true // only if you're using cookies
}));
app.use(express.json());
app.use(cookieParser());
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');

dbConnect();

app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('hello');
})

app.listen(3000, () => { console.log('server listening on port 3000') });