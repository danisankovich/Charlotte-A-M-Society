var User = require('../models/user');
var Message = require('../models/message');

exports.getMessage = (req, res) => {
  var messageChainId = req.params.id
  Message.findById(messageChainId, function(err, message){
    if(err) res.send(err)
    User.findByIdAndUpdate(req.params.user,
      {$set: {"newMessages": false}},
      function(err, user) {
        res.send(message)
      }
    )
  });
}

exports.newMessage = (req, res) => {
  var senderId = req.body.senderId;
  var sender = req.body.senderUsername;
  var recipientId = req.body.recipientId;
  var recipient = req.body.recipientUsername;
  Message.findOne(
    {userIds: { $all: [senderId, recipientId]}},
    function(err, message) {
      if (err) res.send(err)
      if (!message) {
        var newMessageChain = new Message({
          userIds: [senderId, recipientId],
          usernames: [sender, recipient],
          messages: [{
            senderId: senderId,
            senderUsername: sender,
            dateSent: Date.now(),
            message: req.body.message
          }]
        })
        newMessageChain.save(function(err) {
          if(err) res.send(err)
          console.log(newMessageChain._id, err)
          User.findByIdAndUpdate(senderId,
            {$push: {'messagesChainIds': newMessageChain._id}},
            {safe: true, upsert: true},
            function(err, user) {
              if (err) res.send(err)
              User.findByIdAndUpdate(recipientId,
                {$push: {'messagesChainIds': newMessageChain._id}, $set: {"newMessages": true}},
                {safe: true, upsert: true},
                function(err, user) {
                  if (err) res.send(err)
                  res.send(newMessageChain);
                }
              )
            }
          )
        })
      }
      else if (message) {
        var newMessage = {
          senderId: senderId,
          senderUsername: sender,
          dateSent: Date.now(),
          message: req.body.message
        }
        message.messages.push(newMessage)
        message.lastMessage = Date.now()
        message.save(function(err) {
          var nonIndex = message.userIds.indexOf(senderId);
          nonIndex = nonIndex === 0 ? 1 : 0;
          var recipientId = message.userIds[nonIndex]
          User.findByIdAndUpdate(recipientId,
            {$set: {"newMessages": true}},
            {safe: true, upsert: true},
            function(err, user) {
              if (err) res.send(err)
              res.send(message);
            }
          )
        })
      }
    }
  );
}
