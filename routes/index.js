var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var config = require('../config');
var jwt = require('jwt-simple');

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
module.exports = router;
