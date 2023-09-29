const express = require('express')
const {
  registerUser,
  loginUser,
  currentUser,
  updateUser,
} = require('../controllers/userController')
const validateToken = require('../middleware/validateTokenHandler')

const router = express.Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/current/:id', validateToken, currentUser)

router.put('/update/:id', validateToken, updateUser)

module.exports = router
