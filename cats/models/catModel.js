'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllCats = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM wop_cat');
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }   
};

const getCat = async (id) => {
  try {
    const [rows] = await promisePool.query(`SELECT * FROM wop_cat WHERE cat_id = ${id}`);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }   
};

const addCat = async (catData, filename) => {
  //console.log(catData, filename)
  try {
    const [rows] = await promisePool.query(`INSERT INTO 
                                            wop_cat 
                                            (name, age, weight, owner, filename) 
                                            VALUES 
                                            ('${catData.name}', '${catData.age}', '${catData.weight}', '${catData.owner}', '../uploads/${filename}')`);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }   
};

const updateCat = async (catData) => {
  console.log(catData)
  try {
    const [rows] = await promisePool.query(`UPDATE wop_cat
                                            SET name = '${catData.name}', age = '${catData.age}', weight = '${catData.weight}', owner = '${catData.owner}'
                                            WHERE cat_id = ${catData.id};`);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }   
};

const deleteCat = async (id) => {
  try {
    const [rows] = await promisePool.query(`DELETE FROM wop_cat
                                            WHERE
                                            cat_id = ${id}`);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }   
};


module.exports = {
  getAllCats,
  getCat,
  addCat,
  updateCat,
  deleteCat
};