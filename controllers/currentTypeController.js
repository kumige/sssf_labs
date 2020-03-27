'use strict';
const currentTypeModel = require('../models/currentType');

const currentType_list_get = async (req, res) => {
  try {
    res.json(await currentTypeModel.find());  

  } catch (error) {
    res.status(500).json({message: error.message})
    console.error('station_list_get', error);
  }
};

const currentType_get = async (req, res) => {
  try {
    res.json(await currentTypeModel.findById(req.params.id));
  } catch (error) {
    res.status(500).json({message: error.message})
    console.error('station_list_get', error);
  }
};

const currentType_post = (req, res) => {
  res.send('With this endpoint you can add stations');
};

module.exports = {
    currentType_list_get,
    currentType_get,
    currentType_post,
};
