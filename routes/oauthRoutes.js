const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
    res.json({ message: 'Google authentication successful', user: req.user });
    });


module.exports = router;