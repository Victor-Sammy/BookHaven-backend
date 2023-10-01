const express = require('express')
const passport = require('passport')

const clientURL = 'http://localhost:5173'

const router = express.Router()

router.get('/login/success', isAuthenticated, (req, res) => {
  // if (req.session) {
  //   res.status(200).json({ user: req.user })
  // } else {
  //   res.status(401).json({ message: 'Not Authorized' })
  // }
  res.status(200).json({ user: req.user })
})

router.get('/login/failed', (req, res) => {
  res.status(401).json({ message: 'Log in failure!' })
})

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login/failed') // Redirect to the login page if not authenticated
}

router.get('/google', passport.authenticate('google', ['profile', 'email']))

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: clientURL,
    failureRedirect: '/login/failed',
  })
)

router.get('/logout', (req, res) => {
  req.logout({}, (err) => {
    if (err) return res.status(500).json({ message: 'Something went wrong.' })
  })
})

module.exports = router
