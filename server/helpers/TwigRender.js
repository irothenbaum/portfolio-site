const pjson = require('../../package.json')
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing')
const path = require('path')
let loader = new TwingLoaderFilesystem(path.join(__dirname, '..', 'views'))
let twing = new TwingEnvironment(loader)

/**
 * @param {string} template
 * @param {object?} params
 * @returns {Promise<string>}
 */
const TwigRender = function (template, params) {
  if (process.env.NODE_ENV !== 'production') {
    // on dev we need to create a new environment because of: https://github.com/NightlyCommit/twing/issues/337
    // currently the only and easiest way to beat the cache
    twing = new TwingEnvironment(loader)
  }

  params = params || {}
  return twing.render(template + '.twig', {
    // make some configurations available to all views
    site: {
      environment: process.env.NODE_ENV,
      version: pjson.version,
    },

    ...params,
  })
}

module.exports = TwigRender
