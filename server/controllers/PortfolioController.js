const TwigRender = require('../helpers/TwigRender')

class PortfolioController {
  static async getLanding(req, res, next) {
    res.send(await TwigRender('default'))
  }
}

module.exports = PortfolioController
