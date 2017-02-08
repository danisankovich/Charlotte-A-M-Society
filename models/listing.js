var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listingSchema = new Schema({
  name: String,
  startdate: String,
  enddate: String,
  image: String,
  photos: [],
  description: String,
  notes: String,
  user: String,
  username: String,
  email: String
});
var LISTING = mongoose.model('listing', listingSchema);
module.exports = LISTING;
