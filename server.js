"use strict";

require("dotenv").config();
const express = require("express");
const db = require("./database/db");
const graphqlHTTP = require("express-graphql");
const MyGraphQLSchema = require("./schema/schema");
const passport = require('./utils/pass');
const authRoute = require('./routes/authRoute');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

// dummy function to set user (irl: e.g. passport-local)
const auth = (req, res, next) => {
  req.user = true;
  next();
};

// dummy function to check authentication (irl: e.g. passport-jwt)
const checkAuth = (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user) => {
    if(err || !user) {
      throw new Error('Not authenticated')
    }
  })(req, res);
};

//app.post('login', auth)

app.use('/auth', authRoute)

app.use(
  '/graphql', (req, res) => {
    graphqlHTTP({
      schema: MyGraphQLSchema,
      graphiql: true,
      context: {req, res, checkAuth},
    })(req, res);
  });


db.on("connected", () => {
  app.listen(3000);
});
