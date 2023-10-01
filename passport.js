const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
const dotenv = require('dotenv')
const User = require('./models/googleUserModel')

dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.CLIENT_ID}`,
      clientSecret: `${process.env.CLIENT_SECRET}`,
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const user = await User.findById(profile.id)
      if (user) {
        return done(null, user)
      } else {
        const newUser = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          profilePic: profile.emails[0].value,
          _id: profile.id,
        })
        return done(null, newUser)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})
