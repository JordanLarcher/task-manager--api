const express = require('express');
const passport = require('passport');
const router = express.Router();


/**
 * @swagger
 * /api/oauth/google:
 *   get:
 *     summary: Redirect to Google for authentication
 *     tags: [OAuth]
 *     responses:
 *       302:
 *         description: Redirect to Google
 */

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


/**
 * @swagger
 * /api/oauth/google/callback:
 *   get:
 *     summary: Callback from Google OAuth
 *     tags: [OAuth]
 *     responses:
 *       200:
 *         description: Successful Google OAuth authentication
 *       401:
 *         description: Failed authentication
 */
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
    res.json({ message: 'Google authentication successful', user: req.user });
    });


module.exports = router;