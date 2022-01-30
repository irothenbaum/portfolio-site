const TwigRender = require('../helpers/TwigRender')
const wordleJSON = require('../../wordle/package.json')

class PortfolioController {
  static async getLanding(req, res, next) {
    res.send(await TwigRender('default'))
  }

  static async getWordleGame(req, res, next) {
    res.send(await TwigRender('wordle', {
      appVersion: wordleJSON.version
    }))
  }
}

module.exports = PortfolioController
