var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var config = require('../config');
var jwt = require('jwt-simple');

const User = require('../models/user');
const Message = require('../models/message');
const Authentication = require('../controllers/authentication');
const MessageController = require('../controllers/message');

router.get('/:id/:user', MessageController.getMessage);
router.post('/newmessage', MessageController.newMessage);

module.exports = router;
