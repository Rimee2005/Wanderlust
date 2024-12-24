const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

// Render Signup Page
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// Handle Signup
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check for existing user with the same username or email
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        req.flash("error", "A user with that username already exists.");
        return res.redirect("/signup");
      }
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        req.flash("error", "A user with that email already exists.");
        return res.redirect("/signup");
      }

      // Register the new user
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);

      // Automatically log in the user after signup
      req.login(registeredUser, (err) => {
        if (err) {
          req.flash("error", "Something went wrong with auto-login.");
          return res.redirect("/login");
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

// Render Login Page
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// Handle Login
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
   
    res.redirect("/listings");
  }
);

module.exports = router;
