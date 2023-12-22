const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
  is_updated: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  age: { type: Number },
  address: { type: String }
});

module.exports = mongoose.model('User', userSchema);
