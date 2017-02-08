var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  userIds: [],
  usernames: [],
  lastMessage: {type: Date, default: Date.now},
  messages: []
});

var MESSAGE = mongoose.model('message', messageSchema);
module.exports = MESSAGE;
