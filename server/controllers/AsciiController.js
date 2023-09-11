const TwigRender = require('../helpers/TwigRender')
const {
  imageToAscii,
  asciiImageToHTML,
  asciiImageToText,
} = require('../helpers/Ascii')
const fetch = require('node-fetch')

const DEFAULT_WIDTH = 32

class AsciiController {
  static async getPage(req, res, next) {
    res.send(await TwigRender('ascii'))
  }

  /**
   * @param req
   * @param res
   * @param next
   * @return {Promise<void>}
   */
  static async postGenerate(req, res, next) {
    const imagePath = req.body.url

    if (!imagePath) {
      res.status(422).send('Missing required query parameter: q')
      return
    }

    const outputWidth = parseInt(req.body.width) || DEFAULT_WIDTH
    try {
      let fetchedImage = await fetch(imagePath)
      let resBuffer = Buffer.from(await fetchedImage.arrayBuffer())
      const output = await imageToAscii(
        resBuffer,
        outputWidth,
        !!req.body.invert,
      )

      res.json({
        html: asciiImageToHTML(output),
        text: asciiImageToText(output),
        meta: output.meta,
      })
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

module.exports = AsciiController
