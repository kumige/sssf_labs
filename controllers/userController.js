'use strict';
const userModel = require('../models/catModel.js');

const users = userModel.users;

const user_list_get = (req, res) => {
  res.json(users);
};

const user_get = (req, res) => {
    let filteredUser = users.filter(val => req.params.id == val.id)
    res.json(filteredUser)
}
   
module.exports = {
  user_list_get,
  user_get
};