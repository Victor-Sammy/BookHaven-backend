const mongoose = require('mongoose')

const articleSchema = mongoose.Schema(
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
    image: {
      type: String,
      contentType: String,
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
      required: [true, 'Please add the year'],
    },
    resourceType: {
      type: String,
      required: [true, 'Please add the type'],
    },
    subject: {
      type: [String],
      required: [true, 'Please add the subject'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Articles', articleSchema)
