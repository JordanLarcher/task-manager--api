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


            if (!user) {
                // Search for user by email to handle existing users who may have registered with email/password
                user = await User.findOne({ email: profile.emails[0].value });

                if(user) {
                    // If user exists but has no googleId, update the user with googleId
                    user.googleId = profile.id;
                    await user.save();
                } else {
                    //Create a new user if not found
                    // If not, create a new user
                    user = await User.create({
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        googleId: profile.id,
                        role: 'USER' // Default role
                    });
                }

            }

            return done(null, user);
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