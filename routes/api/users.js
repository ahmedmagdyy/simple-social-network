const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../../config/keys");
const passport = require("passport");
const ValidateRegisteration = require('../../validation/register');
const ValidateLogin = require("../../validation/login");



// GET api/users/test
// Test user route
// Public route
router.get("/test", (req, res) => res.json({ msg: "user test route works" }));

// POST api/users/register
// register user
// Public route
router.post("/register", (req, res) => {
//check for errors in registration
  const {errors , isValid} = ValidateRegisteration(req.body);
  if(!isValid) {
    return res.status(400).json(errors)
  }


  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      //check email avatar
      const avatar = gravatar.url(req.body.email, {
        s: "200", // => size
        r: "pg", // => rating
        d: "mm", // => default image
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar,
      });

      //hashing password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// POST api/users/login
// user login & send JWT token to user
// Public route
router.post("/login", (req, res) => {
  //check for errors in login
  const {errors , isValid} = ValidateLogin(req.body);
  if(!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email;
  const password = req.body.password;

  //findone will return a user object if it exists
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //if email is valid will check the password with the hash in db will return boolen
    bcrypt.compare(password, user.password).then(isMatched => {
      if (isMatched) {
        // log user in and send jwt token
        // to generate jwt we have to pass payload(informations about user we want to include in payload)
        // and a secret key included also in jwt
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        };
        jwt.sign(payload, key.secretKey, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            token: "Bearer " + token,
          });
        });
      } else {
        errors.password = "password is incorrect"
        return res.status(400).json(errors);
      }
    });
  });
});

// GET api/users/current
// return current logged in user info
// private route
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  },
);

module.exports = router;
