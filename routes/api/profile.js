const express = require("express");
const router = express.Router();
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const passport = require("passport");

// GET api/profile/test
// Test profile route
// Public route
router.get("/test", (req, res) =>
  res.json({ msg: "profile test route works" }),
);

// GET api/profile
// get user profile if user has one
// Private route
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noProfile = "This User Has No Profile yet";
          res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  },
);


// POST api/profile
// Create or edit user profile
// Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;
  // Skills - Spilt into array seperate by ,
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }
  // Social media links
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({user: req.user.id}).then(profile => {
    //find user profile if exists and update it
    if (profile) {
      Profile.findOneAndUpdate(
        {user: req.user.id},
        {$set: profileFields},
        {new: true}).then(profile => {
          res.json({profile})
        })
    } else {
      //check if handle exists in DB
      Profile.findOne(handle: profileFields.handle)
        .then(profile => {
          if (profile){
            errors.handle = "This Handle already Exists";
            res.status(400).json(errors);
          }
        })

        //if handle not exists save new profile
        new Profile(profileFields)
          .save()
          .then(profile => {
            res.json(profile)
          })
          .catch(err => res.json(err))
    }
  })

module.exports = router;
