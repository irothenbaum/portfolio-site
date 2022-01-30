const TwigRender = require('../helpers/TwigRender')
const appPackageJSON = require('../../wordle/package.json')

class WordlesWithFriendsController {
  static async getApp(req, res, next) {
    res.send(await TwigRender('wordle', {appVersion: appPackageJSON.version}))
  }
}

module.exports = WordlesWithFriendsController
