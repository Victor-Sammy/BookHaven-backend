const express = require('express')
const {
  postToHistory,
  getMyHistory,
  deleteFromHistory,
} = require('../controllers/historyController')
const validateToken = require('../middleware/validateTokenHandler')

const router = express.Router()

router.route('/').get(getMyHistory)

router.route('/:id').delete(deleteFromHistory, validateToken)

router.route('/:id/:modelName').post(postToHistory)

module.exports = router
