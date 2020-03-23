const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const catSchema = new Schema({
  name:  String,
  age: Number,
  gender: ['male', 'female'],
  color: String,
  weight: Number
});

module.exports = mongoose.model('Cat', catSchema);

