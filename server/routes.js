const express = require('express')
const connect = require('connect')
const asyncHandler = require('express-async-handler')
const router = express.Router()
const PortfolioController = require('./controllers/PortfolioController')
const path = require('path')
const GameController = require('./controllers/GameController')
const vhost = require('vhost')
const {MollyAndIsaacSittingInATree} = require('./virtualHosts')
const AsciiController = require('./controllers/AsciiController')

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
router.get('/math-attack', asyncHandler(PortfolioController.getPrivacyPolicy))

// ----------------------------------------------------------------------
// WORDLES WITH FRIENDS

// the App landing page:
router.get(
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
// MEH MOH
router.use(
  '/mehmoh',
  express.static(path.join(__dirname, '..', 'mehmoh', 'dist')),
)

// ----------------------------------------------------------------------
// GAME CLOCK
router.use(
  '/game-clock',
  express.static(path.join(__dirname, '..', 'game-clock', 'dist')),
)

// ----------------------------------------------------------------------
// MEH MOH
router.use(
  '/premove',
  express.static(path.join(__dirname, '..', 'premove', 'dist')),
)

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
// ASCII
router.get('/ascii', asyncHandler(AsciiController.getPage))
router.post('/ascii', asyncHandler(AsciiController.postGenerate))

// ----------------------------------------------------------------------
// CERTBOT
router.use(
  '/.well-known',
  express.static(path.join(__dirname, '..', '.well-known')),
)

module.exports = router
