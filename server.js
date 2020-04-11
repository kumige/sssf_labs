'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const graphQlHttp = require('express-graphql');
const passport = require('./utils/pass');
const schema = require('./schema/schema');
const db = require('./db/db');
const server = express();
const https = require('https');
const http = require('http');
const fs = require('fs');
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')
const options = {
  key: sslkey,
  cert: sslcert
};
const helmet = require('helmet');

server.use(cors());
server.use(express.json()); // for parsing application/json
server.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
server.enable('trust proxy');
server.use(helmet());

server.use(express.static('public'));
server.use('/modules', express.static('node_modules'));

server.use('/graphql', (req, res) => {
  graphQlHttp({schema, graphiql: true, context: {req, res}})(req,
      res);
});

server.use ((req, res, next) => {
  if (req.secure) {
    // request was via https, so do no special handling
    next();
  } else {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  }
});

db.on('connected', () => {
  console.log('db connected');
  if (process.env.NODE_ENV === 'production') {
    const prod = require('./production')(server, process.env.PORT);
  } else {
    const localhost = require('./localhost')(server, process.env.HTTPS_PORT, process.env.HTTP_PORT);
  }
});

//server.listen(3000); //normal http traffic

