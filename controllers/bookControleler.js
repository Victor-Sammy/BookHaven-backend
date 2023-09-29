const asyncHandler = require('express-async-handler')
const Books = require('../models/booksModel')

//@desc get all books
//@route GET /api/books
//@access public
const getBooks = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0
    const limit = parseInt(req.query.limit) || 5
    const search = req.query.search || ''
    let resourceType = req.query.resourceType || 'All'
    let subject = req.query.subject || 'All'

    const typeOptions = ['Journals', 'Book-series']

    const subjectOptions = [
      'Social-Science',
      'Health-and-Medical',
      'Computer-Science',
      'Physics',
      'Earth-Sciences',
      'Chemistry',
      'Arts',
      'Economics',
      'Business',
      'Humanities',
      'Engineering',
      'Life-Sciences',
    ]

    resourceType === 'All'
      ? (resourceType = [...typeOptions])
      : (resourceType = req.query.resourceType.split(','))

    subject === 'All'
      ? (subject = [...subjectOptions])
      : (subject = req.query.subject.split(','))

    const books = await Books.find({ title: { $regex: search, $options: 'i' } })
      .where('resourceType')
      .where('subject')
      .in([...resourceType])
      .in([...subject])
      .skip(page * limit)
      .limit(limit)

    const total = await Books.countDocuments({
      resourceType: { $in: [...resourceType] },
      subject: { $in: [...subject] },
      title: { $regex: search, $options: 'i' },
    })

    const response = {
      errror: false,
      total,
      page: page + 1,
      limit,
      resourceType: typeOptions,
      books,
    }

    res.status(200).json(response)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
  //const allBooks = await Books.find()
  //res.status(200).json(allBooks)
})

//@desc create book
//@route POST /api/books
//@access private
const createBook = asyncHandler(async (req, res) => {
  console.log('The request body is :', req.body)
  const { title, author, description, content, year, type, subject } = req.body
  if (
    !title ||
    !author ||
    !description ||
    !content ||
    !year ||
    !type ||
    !subject
  ) {
    res.status(400)
    throw new Error('All fields are mandatory!')
  }
  const book = await Books.create({
    title,
    author,
    description,
    content,
    year,
    type,
    subject,
  })
  res.status(201).json(book)
})

module.exports = { getBooks, createBook }
