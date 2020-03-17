'use strict';
const catModel = require('../models/catModel.js');

const cats = catModel.cats;

const cat_list_get = (req, res) => {
  res.json(cats);
};

const cat_get = (req, res) => {
    let filteredCat = cats.filter(val => req.params.id == val.id)
    res.json(filteredCat)
}
   
module.exports = {
  cat_list_get,
  cat_get
};