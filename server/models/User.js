const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user", 
  },
  loggedInAt: {
    type: Date,
    default: Date.now 
  },
  profile_dp: {
    type: String, 
    default: '', 
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
