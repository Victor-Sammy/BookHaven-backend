const asyncHandler = require('express-async-handler')
const Articles = require('../models/articleModel')

//@desc get all articles
//@route GET /api/articles
//@access public
const getArticles = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0
    const limit = parseInt(req.query.limit) || 6
    const search = req.query.search || ''
    let resourceType = req.query.resourceType || 'All'
    let subject = req.query.subject || 'All'

    const typeOptions = ['Journals', 'Book series', 'Others']
    const subjectOptions = [
      'Nature Medicine',
      'The new England Journal of Medicine',
      'Journal of Political Economy',
      'Chemical Reviews',
      'Nature Reviews Genetics',
      'Quarterly Journal of Economics',
      'Diabetes and Vascular Disease Research',
      'Advanced Energy Materials',
      'Advanced Materials',
      'Science',
      'Psychology',
    ]

    resourceType === 'All'
      ? (resourceType = [...typeOptions])
      : (resourceType = req.query.resourceType.split(','))
    subject === 'All'
      ? (subject = [...subjectOptions])
      : (subject = req.query.subject.split(','))

    const books = await Articles.find({
      title: { $regex: search, $options: 'i' },
    })
      .where('resourceType')
      .where('subject')
      .in([...resourceType])
      .in([...subject])
      .skip(page * limit)
      .limit(limit)

    const total = await Articles.countDocuments({
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
      subject: subjectOptions,
      books,
    }

    res.status(200).send(response)
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

//@desc create article
//@route POST /api/articles
//@access private
const createArticle = asyncHandler(async (req, res) => {
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
  const article = await Articles.create({
    title,
    author,
    description,
    content,
    year,
    type,
    subject,
  })
  res.status(201).json(article)
})

module.exports = {
  getArticles,
  createArticle,
}
