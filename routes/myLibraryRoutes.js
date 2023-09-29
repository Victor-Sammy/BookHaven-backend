const express = require('express')
const {
  getMyLibray,
  postToLibrary,
  deleteFromLibrary,
} = require('../controllers/myLibraryController')
const router = express.Router()

router.route('/').get(getMyLibray)
router.route('/:id').delete(deleteFromLibrary)
router.route('/:id/:modelName').post(postToLibrary)

module.exports = router
