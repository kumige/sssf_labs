'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./database/db');

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use('/cat', require('./routes/route'));
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


db.on('connected', () => {
  app.listen(3000);
  console.log(`Example app listening on port 3000!`)
});
