const TwigRender = require('../helpers/TwigRender')

class StaticPagesController {
  static async getLanding(req, res, next) {
    res.send(await TwigRender('default'))
  }
}

module.exports = StaticPagesController
