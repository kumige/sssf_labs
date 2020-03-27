'use strict';
const connectionModel = require('../models/connection');

const connection_list_get = async (req, res) => {
  try {
    res.json(await connectionModel.find());  

  } catch (error) {
    res.status(500).json({message: error.message})
    console.error('station_list_get', error);
  }
};

const connection_get = async (req, res) => {
  try {
    res.json(await connectionModel.findById(req.params.id));
  } catch (error) {
    res.status(500).json({message: error.message})
    console.error('station_list_get', error);
  }
};

const connection_post = (req, res) => {
  res.send('With this endpoint you can add stations');
};

module.exports = {
    connection_list_get,
    connection_get,
    connection_post,
};
