'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllUsers = async () => {
    try {
      const [rows] = await promisePool.query('SELECT * FROM wop_user');
      return rows;
    } catch (e) {
      console.log('error', e.message);
    }   
  };
  
  const getUser = async (id) => {
    try {
      const [rows] = await promisePool.query(`SELECT * FROM wop_user WHERE user_id = ${id}`);
      return rows;
    } catch (e) {
      console.log('error', e.message);
    }   
  };

  const addUser = async (userData) => {
      console.log(userData)
    try {
      const [rows] = await promisePool.query(`INSERT INTO wop_user (name, email, password) VALUES ('${userData.name}', '${userData.email}', '${userData.password}')`);
      return rows;
    } catch (e) {
      console.log('error', e.message);
    }   
  };

  const getUserLogin = async (params) => {
    try {
      console.log(params);
      const [rows] = await promisePool.execute(
          'SELECT * FROM wop_user WHERE email = ?;',
          params);
      return rows;
    } catch (e) {
      console.log('error', e.message);
    }
  };

  module.exports = {
    getAllUsers,
    getUser,
    addUser,
    getUserLogin
  };