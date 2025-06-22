const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser=require('cookie-parser');
const dbConnect = require('./dbCon/dbCon');

require('dotenv').config();

const app = express();

dbConnect();
app.use(cors({
    origin: ['http://localhost:4200','https://project-manager-q2zhwffel-crayon-21s-projects.vercel.app'],
    credentials:true
}))
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