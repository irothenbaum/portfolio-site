const express = require('express')
const socketServer = require('./helpers/SocketServerSingleton')
const path = require('path')
const fs = require('fs')
const sslConfig = require('./sslConfig.json')

const protocol = process.env.PROTOCOL || 'http'

const HTTP_PORT = 80
const HTTPS_PORT = 443

const PORT = protocol === 'https' ? HTTPS_PORT : HTTP_PORT

const app = express()

let server
if (protocol === 'http') {
  server = require('http').createServer(app)
} else if (protocol === 'https') {
  server = require('https').createServer(
    {
      key: fs.readFileSync(sslConfig.key, 'utf8'),
      cert: fs.readFileSync(sslConfig.cert, 'utf8'),
      ca: sslConfig.chain ? fs.readFileSync(sslConfig.chain, 'utf8') : null,
    },
    app,
  )

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

app.use('/static', express.static(path.join(__dirname, '..', 'public')))

// load our routes
app.use(require('./routes'))

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500).send(err.message)
})

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
