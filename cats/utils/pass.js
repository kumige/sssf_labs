"use strict";
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const userModel = require("../models/userModel");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// fake database: ****************
const users = [
  {
    user_id: 1,
    name: "Foo Bar",
    email: "foo@bar.fi",
    password: "foobar"
  },
  {
    user_id: 2,
    name: "Bar Foo",
    email: "bar@foo.fi",
    password: "barfoo"
  }
];
// *******************

// fake database functions *********
const getUser = id => {
  const user = users.filter(usr => {
    if (usr.user_id === id) {
      return usr;
    }
  });
  return user[0];
};

const getUserLogin = email => {
  console.log(email);
  const user = users.filter(usr => {
    if (usr.email === email) {
      return usr;
    }
  });
  return user[0];
};
// *****************

// serialize: store user id in session
passport.serializeUser((id, done) => {
  console.log("serialize", id);
  // serialize user id by adding it to 'done()' callback
  done(null, id);
});

// deserialize: get user id from session and get all user data
passport.deserializeUser(async (id, done) => {
  const user = getUser(id);
  console.log("deserialize", user);
  done(null, user);
});

passport.use(
  new Strategy(async (username, password, done) => {
    const params = [username];
    try {
      const [user] = await userModel.getUserLogin(params);
      console.log("Local strategy", user); // result is binary row
      if (user === undefined) {
        return done(null, false, { message: "Incorrect email." });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, { ...user }, { message: "Logged In Successfully" }); // use spread syntax to create shallow copy to get rid of binary row type
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret"
    },
    (jwtPayload, done) => {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      return userModel
        .getUser(jwtPayload.user_id)
        .then(user => {
          return done(null, user);
        })
        .catch(err => {
          return done(err);
        });
        
    }
  )
);

module.exports = passport;
