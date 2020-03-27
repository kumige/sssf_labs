'use strict';
const levelModel = require('../models/level');

const level_list_get = async (req, res) => {
  try {
    res.json(await levelModel.find());  

  } catch (error) {
    res.status(500).json({message: error.message})
    console.error('station_list_get', error);
  }
};

const level_get = async (req, res) => {
  try {
    res.json(await levelModel.findById(req.params.id));
  } catch (error) {
    res.status(500).json({message: error.message})
    console.error('station_list_get', error);
  }
};

const level_post = (req, res) => {
  res.send('With this endpoint you can add stations');
};

module.exports = {
    level_list_get,
    level_get,
    level_post,
};
