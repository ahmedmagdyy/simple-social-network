const express = require('express');
const router = express.Router();


// GET api/users/test
// Test user route
// Public route
router.get('/test', (req, res) => res.json({msg: "user test route works"}))

module.exports = router;