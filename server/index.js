const express = require('express')
const socketServer = require('./helpers/SocketServerSingleton')
const path = require('path')
const fs = require('fs')
const sslConfig = require('./sslConfig.json')
const vhttps = require('vhttps')
const {MollyAndIsaacSittingInATree} = require('./virtualHosts')

/**
 * @param {{key: string, cert: string, ca?: string}} conf
 */
function getOptionsFromSSLConfig(conf) {
  return {
    key: fs.readFileSync(conf.key, 'utf8'),
    cert: fs.readFileSync(conf.cert, 'utf8'),
    ca: conf.chain ? fs.readFileSync(conf.chain, 'utf8') : null,
  }
}

const protocol = process.env.PROTOCOL || 'http'

const HTTP_PORT = 80
const HTTPS_PORT = 443

const PORT = protocol === 'https' ? HTTPS_PORT : HTTP_PORT

const app = express()

app.use('/static', express.static(path.join(__dirname, '..', 'public')))

// load our routes
app.use(require('./routes'))

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500).send(err.message)
})

let server
if (protocol === 'http') {
  server = require('http').createServer(app)
} else if (protocol === 'https') {
  const defaultOptions = getOptionsFromSSLConfig(sslConfig)
  const weddingWebsiteOptions = getOptionsFromSSLConfig(sslConfig.vhosts[MollyAndIsaacSittingInATree])

  server = vhttps.createServer(defaultOptions, [weddingWebsiteOptions], app)

  // force https
  let httpApp = express()
  httpApp.use(function (req, res, next) {
    if (!req.secure) {
      return res.redirect(['https://', req.get('Host'), req.url].join(''))
    }
    next()
  })
  let httpServer = require('http').createServer(httpApp)
  httpServer.listen(HTTP_PORT)
} else {
  throw new Error('Invalid protocol')
}

socketServer(app, server)

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
