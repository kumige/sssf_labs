'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
let catRoutes = require('./routes/catRouter.js')
let userRoutes = require('./routes/userRouter.js')
const app = express();
const port = 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

app.get('/', (req, res) => {
  res.send('Home');
});

app.use('/cat', catRoutes)
app.use('/user', userRoutes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
