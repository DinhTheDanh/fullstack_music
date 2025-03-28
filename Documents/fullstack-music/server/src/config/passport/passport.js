const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('/Users/dinhthedanh/Documents/fullstack-music/server/src/app/models/User.js');
require('dotenv').config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_REDIRECT_URI,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                    });
                }
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        },
    ),
);
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_REDIRECT_URI,
            profileFields: ['id', 'displayName', 'email', 'picture.type(large)'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ facebookId: profile.id });
                if (!user) {
                    user = await User.create({
                        facebookId: profile.id,
                        name: profile.displayName,
                        email: profile.emails ? profile.emails[0].value : '',
                        avatar: `https://graph.facebook.com/${profile.id}/picture?type=large&access_token=${accessToken}`,
                    });
                }
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        },
    ),
);

passport.serializeUser((user, done) => {
    console.log('Đây là sesection', process.env.GOOGLE_CLIENT_ID);
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    console.log('Đây là sesstion', process.env.GOOGLE_CLIENT_ID);
    const user = await User.findById(id);
    done(null, user);
});
