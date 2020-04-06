'use strict'

app.enable('trust proxy')

// Add a handler to inspect the req.secure flag (see
// https://expressjs.com/en/api.html#req.secure). This allows us
// to know whether the request was via http or https.
// https://github.com/aerwin/https-redirect-demo/blob/master/server.js
app.use ((req, res, next) => {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
      // request was via http, so redirect to https
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
  
  module.exports=(app, httpPort) => {
    app.listen(httpPort);

  }
  