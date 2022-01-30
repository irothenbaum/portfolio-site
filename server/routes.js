const express = require('express')
const asyncHandler = require('express-async-handler')
const router = express.Router()
const PortfolioController = require('./controllers/PortfolioController')
const path = require("path");
const GameController = require("./controllers/GameController");

router.get('/', asyncHandler(PortfolioController.getLanding))

router.use('/mollyandisaacsittinginatree', express.static(path.join(__dirname, '..', 'mollyandisaacsittinginatree')))

// ----------------------------------------------------------------------
// WORDLES WITH FRIENDS

// the App landing page:
router.use('/wordles-with-friends', express.static(path.join(__dirname, '..', 'wordle')))

// the static files:
router.use('/app-files/wordles-with-friends/', express.static(path.join(__dirname, '..', 'wordle', 'public')))
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// VERSUS PLATFORM

// Hosts connect endpoint:
router.ws('/versus/create', asyncHandler(GameController.socketCreateGame))

// Opponent connect endpoint:
router.ws('/versus/:code/join', asyncHandler(GameController.socketJoinGame))

// ----------------------------------------------------------------------

module.exports = router
