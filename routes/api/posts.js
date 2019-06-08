const express = require('express');
const router = express.Router();


// GET api/posts/test
// Test posts route
// Public route
router.get('/test', (req, res) => res.json({ msg: "posts test route works" }))

module.exports = router;