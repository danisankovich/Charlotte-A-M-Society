var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var config = require('../config');
var jwt = require('jwt-simple');

var Listing = require('../models/listing');
var User = require('../models/user');
var randomKeyGen = require('../services/randomkeygen');
exports.findOneListing = (req, res) => {
  Listing.findById(req.params.id, (err, listing) => {
    if (err) res.send(err);
    res.send(listing);
  })
}

exports.findMyListings = (req, res) => {
  const data = JSON.parse(req.body.data);
  Listing.find({'_id': { $in: data}}, (err, listings) => {
    if (err) res.send(err);
    res.send(listings);
  });
}

exports.findByLocation = (req, res) => {
  var minPrice = req.query.minPrice || 0;
  var maxPrice = req.query.maxPrice || 5001.00;
  var minRating = req.query.minRating || 0;
  var loc = req.params.location.replace(/undefined/g, '');
  var usCity = loc.split('_')[2].toLowerCase().replace(/_/g, '');
  var city = loc.split('_')[1].toLowerCase().replace(/_/g, '');
  var country = loc.split('_')[0].toLowerCase().replace(/_/g, '');
  if (city.length > 0 && country.length > 0 && usCity.length > 0) {
    Listing.find({
      'location.city': city,
      'location.country': country,
      'location.usCity': usCity,
      'pricePerNight': { $gte :  minPrice, $lte : maxPrice},
      'rating': {$gte: minRating}
    }, (err, listings) => {
      if (err) res.send(err);
      res.send(listings)
    })
  }
  else if (city.length > 0 && country.length > 0) {
    Listing.find({
      'location.city': city,
      'location.country': country,
      'pricePerNight': { $gte :  minPrice, $lte : maxPrice},
      'rating': {$gte: minRating}
    }, (err, listings) => {
      if (err) res.send(err);
      res.send(listings)
    })
  } else if (country.length > 0) {
    Listing.find({
      'location.country': country,
      'pricePerNight': { $gte :  minPrice, $lte : maxPrice},
      'rating': {$gte: minRating}
    }, (err, listings) => {
      if (err) res.send(err);
      res.send(listings)
    })
  }
}
exports.editListing = (req, res) => {
  var updatedListing =JSON.parse(req.body.data).listing;
  var token = req.headers.authorization;

  var decoded = jwt.decode(token, config.secret);
  var userId;
  User.findById(decoded.sub, (err, user) => {
    userId = user._id
    Listing.findById(updatedListing._id, (err, listing) => {
      if (err) {
        res.send(err)
      };
      if (listing.creator.id != userId) {
        res.send('You do not have these permissions');
      }
      else {
        if(['address', 'city', 'usCity', 'country'].indexOf(updatedListing.type) > -1) {
          listing.location[updatedListing.type] = updatedListing.location[updatedListing.type]
        } else {
          listing[updatedListing.type] = updatedListing[updatedListing.type]
        }
        listing.save()
        res.send(listing);
      }
    })
  })

}

exports.newListing = (req, res) => {
  console.log(req.body);
  var data = {
    eventName: req.body.name,
    startdate: req.body.startdate,
    enddate: req.body.enddate,
    description: req.body.description,
    notes: req.body.notes,
    userId: req.body.user,
    email: req.body.email,
    username: req.body.username,
  }

  Listing.create(data, (err, listing) => {
    if(err) res.send(err);
    User.findById(data.userId, (err, user) => {
      if (err || !user) res.send(err);
      user.myListings.push(listing._id)
      user.save();
      res.json(listing)
    });
  });
};

exports.deleteListing = (req, res) => {
  var listing = req.params.id;
  var token = req.headers.authorization;
  var decoded = jwt.decode(token, config.secret);
  User.findById(decoded.sub, (err, user) => {
    if(err) res.send(err)
    var index = user.myListings.indexOf(listing);
    Listing.findByIdAndRemove(listing, (err, listingToRemove) => {
      if(err) {
        res.send(err)
      }
      if (index > -1) {
        user.myListings.splice(index, 1);
        user.save(user)
        res.send(user);
      }
    })
  });
}

exports.applyForBooking = (req, res) => {
  var token = req.headers.authorization;
  var userId = jwt.decode(token, config.secret).sub;
  req.body.userId = userId;
  req.body.listingId = req.params.id;
  req.body.applicationId = randomKeyGen();
  var locs = JSON.parse(req.body.listingLocation);
  req.body.listingLocation = locs
  User.findByIdAndUpdate(userId,
    {$push: {'applications': req.body}},
    {safe: true, upsert: true},
    function(err, user) {
      if (err) res.send(err)
      Listing.findByIdAndUpdate(req.params.id,
        {$push: {'applications': req.body}},
        {safe: true, upsert: true},
        function(err, listing) {
          if (err) res.send(err)
          res.send(listing)
        }
      )
    }
  )
}
exports.reviewApplication = (req, res) => {
  Listing.update({
    '_id' : req.body.listingId, 'applications.applicationId': req.body.applicationId
  },
  { $set: { "applications.$.reviewed" : true } },
  function(err, listing) {
    User.update({
      '_id' : req.body.userId, 'applications.applicationId': req.body.applicationId
    },
    { $set: { "applications.$.reviewed" : true } },
    function(err, user) {
      res.send(listing)
    })
  })
}
exports.approverejectApplication = (req, res) => {
  Listing.update({
    '_id' : req.body.listingId, 'applications.applicationId': req.body.applicationId
  },
  { $set: { "applications.$.approved" : req.body.approved } },
  function(err, listing) {
    User.update({
      '_id' : req.body.userId, 'applications.applicationId': req.body.applicationId
    },
    { $set: { "applications.$.approved" : req.body.approved } },
    function(err, user) {
      res.send(listing)
    })
  })
}
