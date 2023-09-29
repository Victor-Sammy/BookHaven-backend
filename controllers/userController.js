const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
//@desc register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body
  if (!username || !email || !password || !role) {
    res.status(400)
    throw new Error('All fields are mandatory!')
  }
  const userAvailable = await User.findOne({ email })
  if (userAvailable) {
    res.status(400)
    throw new Error('User already registered!')
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10)
  console.log('Hashed Password: ', hashedPassword)
  const user = await User.create({
    username,
    email,
    role,
    password: hashedPassword,
  })
  console.log(`User created ${user}`)
  if (user) {
    res.status(201).json({ id: user.id, email: user.email })
  } else {
    res.status(400)
    throw new Error('User data is not valid')
  }
  res.json({ message: 'Register the user' })
})

//@desc login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    throw new Error('All fields are mandatory!')
  }
  const user = await User.findOne({ email })
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    )
    res.status(200).json({ accessToken, user })
  } else {
    res.status(401)
    throw new Error('email or password is not valid')
  }
})

//update user
//POST /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id
  const { email, username } = req.body

  try {
    // Find the user by ID and update its fields
    const user = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
      },
      { new: true }
    ).exec()

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' })
  }
})

//@desc current user
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  const userId = req.params.id
  await User.findOne({ _id: userId })
    .then((updatedUser) => {
      if (updatedUser) {
        console.log('updated user:', updatedUser)
        res.json({ user: updatedUser })
      } else {
        console.log('user not found')
      }
    })
    .catch((error) => {
      console.log('error fetching updated user:', error)
    })
  res.status(200)
})

module.exports = { registerUser, loginUser, currentUser, updateUser }
