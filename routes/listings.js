var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var config = require('../config');
var jwt = require('jwt-simple');


const Listing = require('../models/listing');
const User = require('../models/user');

const ListingController = require('../controllers/listing');

router.get('/:id', ListingController.findOneListing);
router.post('/mylistings', ListingController.findMyListings);
router.get('/location/:location', ListingController.findByLocation);
router.post('/new', ListingController.newListing);
router.post('/editListing', ListingController.editListing);
router.delete('/deleteListing/:id', ListingController.deleteListing);
router.put('/apply/:id', ListingController.applyForBooking)
router.put('/reviewedapplication', ListingController.reviewApplication)
router.put('/approverejectapplication', ListingController.approverejectApplication)
module.exports = router;
