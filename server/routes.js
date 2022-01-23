const express = require('express')
const asyncHandler = require('express-async-handler')
const router = express.Router()
const StaticPagesController = require('./controllers/StaticPagesController')

router.get('/', asyncHandler(StaticPagesController.getLanding))

module.exports = router
