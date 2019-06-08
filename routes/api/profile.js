const express = require('express');
const router = express.Router();


// GET api/profile/test
// Test profile route
// Public route
router.get('/test', (req, res) => res.json({ msg: "profile test route works" }))

module.exports = router;