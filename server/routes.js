const express = require('express')
const asyncHandler = require('express-async-handler')
const router = express.Router()
const StaticPagesController = require('./controllers/StaticPagesController')
const path = require("path");

router.get('/', asyncHandler(StaticPagesController.getLanding))

router.use('/mollyandisaacsittinginatree', express.static(path.join(__dirname, '..', 'mollyandisaacsittinginatree')))

module.exports = router
