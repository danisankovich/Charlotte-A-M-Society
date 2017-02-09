var User = require('../models/user');
var jwt = require('jwt-simple');
var config = require('../config');
var bcrypt = require('bcrypt-nodejs');

tokenForUser = (user) => {
  var timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = function(req, res, next) {
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  if (!email || !password) {
    return res.status(422).send({error: 'Email and Password Must Be Provided'});
  }
  User.findOne({email: email}, (err, user) => {
    if (err) return next(err);
    if (user) {
      return res.status(422).send({error: 'Email Already In Use'});
    } else {
      var newUser = new User({
        email: email,
        password: password,
        username: username
      });
      bcrypt.genSalt(10, function(err, salt) {
        if (err) { return next(err); }
        bcrypt.hash(newUser.password, salt, null, function(err, hash) {
          if (err) {return next(err); }
          newUser.password = hash;
          newUser.save((err) => {
            if (err) return next(err);
            res.json({token: tokenForUser(newUser)});
          });
        })
      })
    }
  })
}

exports.signin = function(req, res, next) {
  res.send({token: tokenForUser(req.user)});
}
exports.getUser = (req, res) => {
  var token = req.headers.authorization;
  var user;
  if(token) {
    try {
      var decoded = jwt.decode(token, config.secret);
      User.findById(decoded.sub, (err, user) => {
        user = user
        res.send(user)
      })
     }
     catch (e) {
       return res.status(401).send('authorization required');
     }
  }
  else {
    res.send({user: "NO_USER"})
  }
}
exports.getUserProfile = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) res.send(err);
    res.send(user)
  })
}
exports.editInfo = function(req, res, next) {
  const data = JSON.parse(req.body.data);
  var newPhone = data.phoneNumber;
  var newEmail = data.email;
  var aboutMe = data.aboutMe;
  User.findById(data.user, (err, user) => {
    user.phoneNumber = newPhone || user.phoneNumber;
    user.email = newEmail || user.email;
    user.aboutMe = aboutMe || user.aboutMe;
    user.save()
    res.send(user);
  })
}
exports.uploadMyPhoto = (req, res) => {
  User.findById(req.body.user, (err, user) => {
    var _id = user.myPhotos.length;
    user.myPhotos.push({
      image: req.body.image,
      tagline: req.body.tagline,
      location: req.body.location,
      showcased: false,
      _id
    })
    user.save();
    res.send(user);
  })
}
exports.uploadAvatar = (req, res) => {
  User.findById(req.body.user, (err, user) => {
    var _id = user.myPhotos.length;
    user.avatar = req.body.image
    user.save();
    res.send(user);
  })
}

exports.addFollower = (req, res) => {
  var token = req.headers.authorization;
  if(token) {
    try {
      var decoded = jwt.decode(token, config.secret);
      User.findByIdAndUpdate(
        decoded.sub, {$addToSet: {"following": req.body.user}}, {safe: true, upsert: true},
        function(err, user) {
          if (err) res.send(err);
          res.send(user);
        }
      )
     }
     catch (e) {
       return res.status(401).send('authorization required');
     }
  }
  else {
    res.send({user: "NO_USER"})
  }
}
exports.removeFollower = (req, res) => {
  var token = req.headers.authorization;
  if(token) {
    try {
      var decoded = jwt.decode(token, config.secret);
      User.findByIdAndUpdate(
        decoded.sub, {$pull: {"following": req.body.user}}, { multi: true },
        function(err, user) {
          if (err) res.send(err);
          res.send(user);
        }
      )
     }
     catch (e) {
       return res.status(401).send('authorization required');
     }
  }
  else {
    res.send({user: "NO_USER"})
  }
}
