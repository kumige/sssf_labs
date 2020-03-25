const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name:  String,
  email: String, 
  owner: { type: mongoose.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('User', userSchema);