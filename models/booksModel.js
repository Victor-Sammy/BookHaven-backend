const mongoose = require('mongoose')

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add the title'],
    },
    author: {
      type: String,
      required: [true, 'Please add the author'],
    },
    description: {
      type: String,
    },
    modelName: {
      type: String,
    },
    pdf: {
      type: Buffer,
      required: true,
    },
    year: {
      type: Number,
    },
    resourceType: {
      type: [String],
    },
    subject: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Books', bookSchema)
