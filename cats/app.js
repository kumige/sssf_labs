'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('./utils/pass.js');
const cors = require('cors');
let catRoutes = require('./routes/catRouter.js')
let userRoutes = require('./routes/userRouter.js')
let authRoutes = require('./routes/authRouter.js')
const app = express();
const port = 3000;


const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/form');
  }
};

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Home');
});

app.get('/form', (req, res) => {
  res.send('login failed');
});

app.get('/secret', loggedIn, (req, res) => {
  res.send('login successful');
  console.log('secret')
});

app.post('/login',
    passport.authenticate('local', {failureRedirect: '/form'}),
    (req, res) => {
      console.log('success');
      res.redirect('/secret');
    });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.use('/cat', passport.authenticate('jwt', {session: false}), catRoutes)
app.use('/user', passport.authenticate('jwt', {session: false}), userRoutes)
app.use('/auth', authRoutes)


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
