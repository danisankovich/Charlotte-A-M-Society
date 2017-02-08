var passport = require('passport');
var User = require('../models/user');
var config = require('../config');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local');

var localOptions = {usernameField: 'email'};
var localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email: email }, (err, user) => {
    if (err) { return done(err); }
    if(!user) { return done(null, false); }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }
      return done(null, user);
    });
  });
});

// JWT Strategy Options
var jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'), //looks at request header for a token
  secretOrKey: config.secret
};

// Create jwt strategy and see if user Id from payload exists in database.
var jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  console.log('here', payload)
  User.findById(payload.sub, (err, user) => {
    //if err, call done with eror and no user
    if (err) { return done(err, false); }
    // if authenticated and yes user, call done with null error and a user
    if (user) { done(null, user); }
    // if not authenticated, but no error
    else { done(null, false); }
  })
})

passport.use(jwtLogin);
passport.use(localLogin);
