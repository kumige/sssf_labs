'use strict';
const express = require('express');
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
  }
})
var upload = multer({ storage: storage })
const router = express.Router();
const catController = require('../controllers/catController');

router.get('/', catController.cat_list_get);

router.get('/:id', catController.cat_get);

router.post('/', (req, res) => {
  res.send('With this endpoint you can add cats');
  console.log(req)
});

router.post('/upload', upload.single('cat'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file)
  res.send("haha")
})

router.put('/', (req, res) => {
  res.send('With this endpoint you can edit cats');
});

router.delete('/', (req, res) => {
  res.send('With this endpoint you can delete cats');
});

module.exports = router