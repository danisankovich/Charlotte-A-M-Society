var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
  creator: {
    username: String,
    id: String,
  },
  images: Array,
  dateCreated: { type: Date, default: Date.now },
  lastModified: {type: Date},
  tagline: String,
  title: String,
  keywords: [],
  body: String,
  previewImage: String,
  comments: [{
    userId: String,
    dateCreated: {type: Date, default: Date.now},
    username: String,
    comment: String,
    comments: {type: Array, default: []}
  }]
});
var BLOG = mongoose.model('blog', blogSchema);
module.exports = BLOG;
