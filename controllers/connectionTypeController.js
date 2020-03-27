'use strict';
const connectionTypeModel = require('../models/connectionType');

const connectiontype_list_get = async (req, res) => {
  try {
    res.json(await connectionTypeModel.find());  

  } catch (error) {
    res.status(500).json({message: error.message})
    console.error('station_list_get', error);
  }
};

const connectiontype_get = async (req, res) => {
  try {
    res.json(await connectionTypeModel.findById(req.params.id));
  } catch (error) {
    res.status(500).json({message: error.message})
    console.error('station_list_get', error);
  }
};

const connectiontype_post = (req, res) => {
  res.send('With this endpoint you can add stations');
};

module.exports = {
    connectiontype_list_get,
    connectiontype_get,
    connectiontype_post,
};