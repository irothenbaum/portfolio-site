const TwigRender = require('../helpers/TwigRender')
const wordleJSON = require('../../wordle/package.json')
const {MATH_ATTACK_PLAY_STORE, MATH_ATTACK_APP_STORE} = require('../constants')

class PortfolioController {
  static async getLanding(req, res, next) {
    res.send(
      await TwigRender('portfolio', {
        mathAttackPlayStore: MATH_ATTACK_PLAY_STORE,
        mathAttackAppStore: MATH_ATTACK_APP_STORE,
      }),
    )
  }

  static async getBackLit(req, res, next) {
    res.send(await TwigRender('backlit'))
  }

  static async getWordleGame(req, res, next) {
    res.send(
      await TwigRender('wordle', {
        appVersion: wordleJSON.version,
      }),
    )
  }
}

module.exports = PortfolioController
