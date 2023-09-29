const asyncHandler = require('express-async-handler')
const Articles = require('../models/articleModel')
const Books = require('../models/booksModel')
const History = require('../models/historyModel')

const getMyHistory = asyncHandler(async (req, res) => {
  const search = req.query.search || ''
  const historyBooks = await History.find({
    title: { $regex: search, $options: 'i' },
  })
  res.status(200).json(historyBooks)
})

const postToHistory = asyncHandler(async (req, res) => {
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

  const newHistoryItem = {
    title: bookData.title,
    author: bookData.author,
    description: bookData.description,
    modelName: 'History',
    pdf: bookData.pdf,
    year: bookData.year,
    resourceType: bookData.resourceType,
    subject: bookData.subject,
    loading: false,
  }

  const newHistory = new History(newHistoryItem)
  await newHistory.save()
  res.json(newHistory)
})

const deleteFromHistory = asyncHandler(async (req, res) => {
  const itemToDelete = await History.findById(req.params.id)
  if (!itemToDelete) {
    res.status(404)
    throw new Error('Item not found!')
  }
  await History.findByIdAndDelete({ _id: req.params.id })
  res.status(200).json(itemToDelete)
})

module.exports = {
  getMyHistory,
  postToHistory,
  deleteFromHistory,
}
