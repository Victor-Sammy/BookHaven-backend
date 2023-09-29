const express = require('express')
const { getBooks, createBook } = require('../controllers/bookControleler')

const router = express.Router()

router.route('/').get(getBooks)
router.route('/').post(createBook)

module.exports = router
