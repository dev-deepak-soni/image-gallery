const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/image-gallery-backend';

mongoose.connect(uri);

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});


process.on('SIGINT', () => {
  mongoose.connection.close().then(() => {
    console.log('MongoDB connection closed due to application termination');
    process.exit(0);
  });
});



module.exports = db;