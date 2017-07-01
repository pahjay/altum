/**
 * Created by dev on 6/20/2017.
 */
var express = require('express');
var logger  = require('morgan');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// not sure if needed, run w/o and see if it works
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

// connect mongoose to db
mongoose.connect('mongodb://localhost/angulobby');

// user schema/model
var User = require('./models/user.js');

// create an instance of express
var app = express();

// require routes
var routes = require('./routes/api.js');
var noteRoute = require('./routes/notificationtest.js');

// middleware definitions
// middleware allows you to define a stack of actions that you should flow through
// express servers themselves are a stack of middlewares
app.use(express.static(path.join(__dirname, '../public')));
// __dirname is the path to the current module
// for example, __dirname of this file is /angulobby/server/

// dev defined the output of the logger, in this case formats log for dev use
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({
  secret: 'TempSecretKey',
  resave: false,
  saveUninitialized: false
}));
// required for express
app.use(passport.initialize());
// required fogit r persistant login sessions
app.use(passport.session());

// passport configuration
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.use('/user/', routes);
app.use('/note/', noteRoute);

// serve angular front end files from root path
app.use('/', express.static('public', { redirect: false }));

// reswite virtual urls to angular app to enable refreshing of internal pages
app.get('*', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// error handlers
app.use(function(req, res, next) {
  var err = new Error('not found');
  err.status = 404;
  // report error in middleware
  next(err);
});

// TODO: handle production vs development error handling
// TODO: Stack trace will leak to client if error == {}
// TODO: error should be equal to err
// see: https://www.joyent.com/node-js/production/design/errors
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
