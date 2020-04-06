"use strict";

require("dotenv").config();
const express = require("express");
const db = require("./database/db");
const graphqlHTTP = require("express-graphql");
const MyGraphQLSchema = require("./schema/schema");
const passport = require('./utils/pass');
const authRoute = require('./routes/authRoute');
const cors = require('cors');
const https = require('https');
const http = require('http');
const fs = require('fs');
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')
const options = {
  key: sslkey,
  cert: sslcert
};
const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.enable('trust proxy');



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

  app.use ((req, res, next) => {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
      // request was via http, so redirect to https
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
  

app.get('/', (req, res) => {
  res.send('wowee')
})


db.on("connected", () => {
  /*app.listen(3000);
  http.createServer((req, res) => {
    res.writeHead(301, { 'Location': 'https://localhost:8000' + req.url });
    res.end();
}).listen(3000);


  https.createServer(options, app).listen(8000);*/
  if (process.env.NODE_ENV === 'production') {
    const prod = require('./production')(app, process.env.PORT);
  } else {
    const localhost = require('./localhost')(app, process.env.HTTPS_PORT, process.env.HTTP_PORT);
  }
  

});
