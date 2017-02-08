var express = require('express');
var router = express.Router();
var config = require('../config');
var jwt = require('jwt-simple');
var User = require('../models/user');
var Blog = require('../models/blog');

exports.findAllBlogs = (req, res, next) => {
  var keywords = req.params.id.split('_');
  if (!keywords || keywords.length === 0 || req.params.id === 'undefined') {
    Blog.find({}, (err, blogs) => {
      if (err) res.send(err);
      res.send(blogs);
    })
  } else if (req.params.id !== 'undefined' && req.query.type === 'inclusive'){
    Blog.find({keywords: {
      $in : keywords
    }}, (err, blogs) => {
      if (err) res.send(err);
      res.send(blogs);
    })
  } else {
    Blog.find({keywords: {
      $all : keywords
    }}, (err, blogs) => {
      if (err) res.send(err);
      res.send(blogs);
    })
  }
}

exports.newBlog = (req, res, next) => {
  var newBlog = {
    creator: {
      username: req.body.username,
      id: req.body.id,
    },
    images: req.body.images,
    tagline: req.body.tagline,
    title: req.body.title,
    keywords: req.body.keywords.split(' '),
    body: req.body.body,
    comments: req.body.comments
  };
  Blog.create(newBlog, (err, blog) => {
    if (err) res.send(err)
    User.findById(req.body.id, (err, user)=> {
      if(err) res.send(err);
      user.blogs.push(blog);
      user.save();
      res.json(user)
    })
  })
}

exports.findOneBlog = (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) res.send(err)
    else if (!err && blog && blog.creator) {
      User.findById(blog.creator.id, (err, user) => {
        res.send({blog, blogList: user.blogs})
      })
    } else {
      res.send("NOTHING FETCHED")
    }
  })
}

exports.newBlogComment = (req, res) => {
  Blog.findByIdAndUpdate(
    req.params.id,
    {$push: {"comments": req.body}},
    {safe: true, upsert: true},
    function(err, blog) {
      User.update({
        '_id' : blog.creator.id, 'blogs._id': blog._id
      },
      { $push: { "blogs.$.comments" : req.body } },
      function(err, user) {
        res.send(blog)
      })
    }
  );
}
exports.searchBlogKeyword = (req, res) => {
  var keywords = req.params.id.split('_');
  Blog.find({keywords: {
    $in : keywords
  }}, (err, blogs) => {
    if (err) res.send(err);
    res.send(blogs);
  })
}
exports.deleteBlog = (req, res) => {
  var blog = req.params.id;
  var token = req.headers.authorization;
  var decoded = jwt.decode(token, config.secret);
  User.findById(decoded.sub, (err, user) => {
    if(err) res.send(err)
    var index;
    user.blogs.forEach((e, i) => {
      if (e._id == blog) {
        index = i;
      };
    })
    Blog.findByIdAndRemove(blog, (err, blogToRemove) => {
      if(err) {
        res.send(err)
      }
      if (index > -1) {
        user.blogs.splice(index, 1);
        user.save(user)
        res.send(user);
      }
    })
  });
}
exports.editBlog = (req, res) => {
  const type = req.body.type
  if(type === 'newBody') {
    Blog.findByIdAndUpdate(req.body.id,
      { $set: { 'body' : req.body.change } },
      function(err, blog) {
        User.update({
          '_id' : req.body.userId, 'blogs._id': blog._id
        },
        { $set: { "blogs.$.body" : req.body.change } },
        function(err, user) {
          res.send(blog)
        })
      }
    )
  } else if(type === 'newTagline') {
    Blog.findByIdAndUpdate(req.body.id,
      { $set: { 'tagline' : req.body.change } },
      function(err, blog) {
        User.update({
          '_id' : req.body.userId, 'blogs._id': blog._id
        },
        { $set: { "blogs.$.tagline" : req.body.change } },
        function(err, user) {
          res.send(blog)
        })
      }
    )
  } else if(type === 'newTitle') {
    Blog.findByIdAndUpdate(req.body.id,
      { $set: { 'title' : req.body.change } },
      function(err, blog) {
        User.update({
          '_id' : req.body.userId, 'blogs._id': blog._id
        },
        { $set: { "blogs.$.title" : req.body.change } },
        function(err, user) {
          res.send(blog)
        })
      }
    )
  } else {
    res.send()
  }

}
