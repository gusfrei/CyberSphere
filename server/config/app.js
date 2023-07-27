const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const favicon = require('express-favicon'); // Import the favicon middleware

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// import "mongoose" - required for DB Access
const mongoose = require('mongoose');
// URI
const DB = require('./db');

const indexRouter = require('../routes/index');
const incidentsRouter = require('../routes/incidents');

// Create the express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.URI || DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });
const mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
  console.log('Connected to MongoDB...');
});

// Uncomment the favicon middleware
app.use(favicon(path.join(__dirname, '../../client/favicon.ico')));


// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Middleware to set the 'isLoggedIn' variable for navigation
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.isAuthenticated();
  next();
});

// Set up session and passport middlewares
app.use(session({
  secret: 'SomeSecret', // Change this to a strong, unique key
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, async (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect username.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Set up middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../client')));

// Define routers
app.use('/', indexRouter); // top level routes
app.use('/incidents', incidentsRouter); // routes for incidents

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
