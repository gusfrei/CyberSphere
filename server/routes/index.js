const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')
const bcrypt = require('bcryptjs');

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the game model
let incident = require('../models/incidents');

/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    incidents: ''
   });
});

// GET login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// POST login form submission
router.post('/login', passport.authenticate('local', {
  successRedirect: '/incidents',
  failureRedirect: '/login',
  failureFlash: true
}));

// GET logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// POST user registration form submission
router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  User.findOne({ username: username }, async (err, existingUser) => {
    if (err) return next(err);

    if (existingUser) {
      // If the username is already taken, render the registration form again with an error message
      return res.render('register', {
        title: 'Register',
        errorMessage: 'Username already taken. Please choose a different username.',
      });
    }

    try {
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user object with the provided username and hashed password
      const newUser = new User({
        username: username,
        password: hashedPassword,
      });

      // Save the new user to the database
      newUser.save((err) => {
        if (err) return next(err);

        // Redirect to the login page after successful registration
        res.redirect('/login');
      });
    } catch (error) {
      return next(error);
    }
  });
});

// GET user registration page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register', errorMessage: '' });
});

module.exports = router;
