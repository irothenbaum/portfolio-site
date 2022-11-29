const TwigRender = require('../helpers/TwigRender')
const wordleJSON = require('../../wordle/package.json')

class PortfolioController {
  static async getLanding(req, res, next) {
    res.send(await TwigRender('portfolio'))
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

  static async getPrivacyPolicy(req, res, next) {
    res.send(await TwigRender('privacy-policy'))
  }
}

module.exports = PortfolioController
