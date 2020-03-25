'use strict';
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/', userController.user_list_get);

router.get('/:id', userController.user_get);

router.post('/', userController.user_create_post);

router.put('/', (req, res) => {
  res.send('With this endpoint you can edit cats');
});

router.delete('/', (req, res) => {
  res.send('With this endpoint you can delete cats');
});

module.exports = router