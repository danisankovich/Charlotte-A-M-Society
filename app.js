var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ejs = require('ejs');
var routes = require('./routes/index');
var listings = require('./routes/listings');
var blogs = require('./routes/blogs');
var messages = require('./routes/messages');

var app = express();


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:auth/cams');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/listings', listings);
app.use('/api/blogs', blogs);
app.use('/api/messages', messages);

// app.set('view engine', 'ejs');
app.get('*', (req, res) => {
  var indexPath = path.join(__dirname, 'views/index.html');
  res.sendFile(indexPath);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
      res.render(path.join('views/error.html'), {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(path.join(__dirname, 'views/error.ejs'));
  res.render(path.join(__dirname, 'views/error.ejs'), {
    message: err.message,
    error: {}
  });
});


module.exports = app;
