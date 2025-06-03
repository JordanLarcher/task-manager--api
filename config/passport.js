const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/User');


passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists in our db
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                return done(null, user);
            }

            // If not, create a new user
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                role: 'USER' // Default role
            });

            done(null, user);
        } catch (error) {
            console.error(error);
            done(error, null);
        }
    })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});