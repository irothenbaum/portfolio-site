const express = require('express')
const connect = require('connect')
const asyncHandler = require('express-async-handler')
const router = express.Router()
const PortfolioController = require('./controllers/PortfolioController')
const path = require('path')
const GameController = require('./controllers/GameController')
const vhost = require('vhost')
const {MollyAndIsaacSittingInATree} = require('./virtualHosts')

// ----------------------------------------------------------------------
// WEDDING WEBSITE
const MollyAndIsaacSittingInATreeSite = express.static(
  path.join(__dirname, '..', 'mollyandisaacsittinginatree'),
)
router.use(vhost(MollyAndIsaacSittingInATree, MollyAndIsaacSittingInATreeSite))
router.use('/mollyandisaacsittinginatree', MollyAndIsaacSittingInATreeSite)

// ----------------------------------------------------------------------

router.get('/', asyncHandler(PortfolioController.getLanding))
router.get('/backlit', asyncHandler(PortfolioController.getBackLit))

// ----------------------------------------------------------------------
// WORDLES WITH FRIENDS

// the App landing page:
router.use(
  '/wordles-with-friends',
  asyncHandler(PortfolioController.getWordleGame),
)

// the static files:
router.use(
  '/app-files/wordles-with-friends',
  express.static(path.join(__dirname, '..', 'wordle', 'public')),
)
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// VERSUS PLATFORM

// looks like optional params syntax is not supported, so we list out all possibilities
// Hosts connect endpoint:
router.ws('/versus/create', asyncHandler(GameController.socketCreateGame))
router.ws('/versus/create/:code', asyncHandler(GameController.socketCreateGame))
router.ws(
  '/versus/create/:code/:recoveryCode',
  asyncHandler(GameController.socketCreateGame),
)

// Opponent connect endpoint:
router.ws('/versus/:code/join', asyncHandler(GameController.socketJoinGame))
router.ws(
  '/versus/:code/join/:recoveryCode',
  asyncHandler(GameController.socketJoinGame),
)

// ----------------------------------------------------------------------
// CERTBOT
router.use(
  '/.well-known',
  express.static(path.join(__dirname, '..', '.well-known')),
)

module.exports = router
