var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var config = require('../config');
var jwt = require('jwt-simple');

const User = require('../models/user');
const Blog = require('../models/blog');

const BlogController = require('../controllers/blog');

router.get('/:id', BlogController.findAllBlogs);
router.post('/new', BlogController.newBlog);
router.get('/blog/:id', BlogController.findOneBlog);
router.post('/newComment/:id', BlogController.newBlogComment);
router.get('/searchkeyword', BlogController.searchBlogKeyword);
router.delete('/deleteBlog/:id', BlogController.deleteBlog);
router.put('/editblog', BlogController.editBlog);

module.exports = router;
