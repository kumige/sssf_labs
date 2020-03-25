'use strict';
const catModel = require('../models/catModel.js');

const cats = catModel.cats;

const cat_list_get = async (req, res) => {
  const cats = await catModel.getAllCats();
  res.json(cats);
};

const cat_get = async (req, res) => {
    const cats = await catModel.getCat(req.params.id);
    res.json(cats);
}

const add_cat = async (req, res) => {
  console.log(req.body)
  const cats = await catModel.addCat(req.body, req.file.filename);
  res.json(cats);
}

const cat_update_put = async (req, res) => {
  const cats = await catModel.updateCat(req.body);
  res.json(cats);
}

const cat_delete = async (req, res) => {
  const cats = await catModel.deleteCat(req.params.id);
  res.json(cats);
}
   
module.exports = {
  cat_list_get,
  cat_get,
  add_cat,
  cat_update_put,
  cat_delete
};