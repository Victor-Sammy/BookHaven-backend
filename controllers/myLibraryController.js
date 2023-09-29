const asyncHandler = require('express-async-handler')
const Articles = require('../models/articleModel')
const Books = require('../models/booksModel')
const Library = require('../models/libraryModel')

//const articles = []

const postToLibrary = asyncHandler(async (req, res) => {
  const modelName = req.params.modelName

  let Model

  switch (modelName) {
    case 'Books':
      Model = Books
      break
    case 'Articles':
      Model = Articles
      break
    default:
      return res.status(400).json({ error: 'Invalid model name' })
  }

  const bookData = await Model.findById(req.params.id)
  if (!bookData) {
    return res.status(400).send('book not found')
  }

  const newFavouriteItem = {
    title: bookData.title,
    author: bookData.author,
    description: bookData.description,
    modelName: 'Library',
    pdf: bookData.pdf,
    year: bookData.year,
    resourceType: bookData.resourceType,
    subject: bookData.subject,
    loading: false,
  }

  const newFavourite = new Library(newFavouriteItem)
  await newFavourite.save()
  res.json(newFavourite)
})

const getMyLibray = asyncHandler(async (req, res) => {
  const search = req.query.search || ''
  const libraryBooks = await Library.find({
    title: { $regex: search, $options: 'i' },
  })
  res.status(200).json(libraryBooks)
})

const deleteFromLibrary = asyncHandler(async (req, res) => {
  const favouriteItem = await Library.findById(req.params.id)
  if (!favouriteItem) {
    res.status(404)
    throw new Error('Item not found!')
  }
  await Library.findByIdAndDelete({ _id: req.params.id })
  res.status(200).json(favouriteItem)
})

module.exports = { getMyLibray, postToLibrary, deleteFromLibrary }
