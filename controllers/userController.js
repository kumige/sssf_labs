'use strict';
const userModel = require('../models/userModel.js');

const user_list_get = async (req, res) => {
  const users = await userModel.getAllUsers();
  res.json(users);
};

const user_get = async (req, res) => {
  const users = await userModel.getUser(req.params.id);
  res.json(users);
}

const user_create_post = async (req, res) => {
  const users = await userModel.addUser(req.body);
  res.json(users);
}
   
module.exports = {
  user_list_get,
  user_get,
  user_create_post
};