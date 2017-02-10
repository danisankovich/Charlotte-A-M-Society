var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var config = require('../config');
var jwt = require('jwt-simple');
var request = require('request');

const Authentication = require('../controllers/authentication');
const passportService = require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false}); //token based, not session
const requireSignin = passport.authenticate('local', {session: false});
const authenticate = expressJwt({secret : config.secret});

const User = require('../models/user');

router.get('/api', requireAuth, Authentication.getUser);
router.put('/api/addfollower', requireAuth, Authentication.addFollower);
router.put('/api/removefollower', requireAuth, Authentication.removeFollower);
router.get('/api/user/:id', Authentication.getUserProfile);
router.post('/api/signup', Authentication.signup);
router.post('/api/signin', requireSignin, Authentication.signin);
router.post('/api/editInfo', Authentication.editInfo);
router.post('/api/uploadmyphoto', Authentication.uploadMyPhoto);
router.post('/api/uploadavatar', Authentication.uploadAvatar);
router.get('/api/test', (req, res, next) => {
  request('https://api.meetup.com/2/groups?offset=0&format=json&group_urlname=CharlotteAnimeManga&photo-host=public&page=20&radius=25.0&fields=&order=id&desc=false&sig_id=184181742&sig=050cc9e621259cbdace3d28d600c73d1c054921e',
    (err, response, body) => {
      if (err) res.send(err);
      res.send(JSON.parse(body).results[0])
    })
})
module.exports = router;
