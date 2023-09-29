const mongoose = require('mongoose')

const userEnum = [
  'Academic researcher',
  'Corporate researcher',
  'Lecturer',
  'Librarian',
  'Master or under-graduate student',
  'Other professional',
  'phD student',
  'Publishing professional',
]

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a user name'],
    },
    email: {
      type: String,
      required: [true, 'Please add a user email address'],
      unique: [true, 'Email address already taken'],
    },
    role: {
      type: String,
      enum: userEnum,
    },
    password: {
      type: String,
      required: [true, 'Please add a user password'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
