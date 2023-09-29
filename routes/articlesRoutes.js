const express = require('express')
const {
  getArticles,
  createArticle,
} = require('../controllers/articleController')

const router = express.Router()

router.route('/').get(getArticles)

router.route('/').post(createArticle)

module.exports = router
