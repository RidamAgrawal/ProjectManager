const mongoose = require('mongoose');

function dbConnect() {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => {
        console.log('Connected to ProjectManagementApplication');
    }).catch(err => {
        console.error('MongoDB connection error:', err.message);
    });
}
module.exports = dbConnect;