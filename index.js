const express = require('express')
const http = require('http')
const path = require('path')
const reload = require('reload')
const bodyParser = require('body-parser')
const logger = require('morgan')

const publicDir = path.join(__dirname, 'public')

const app = express()
app.use(express.static(publicDir))

app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) // Parses json, multi-part (file), url-encoded

app.get('/', function (req, res) {
  res.sendFile(path.join(publicDir, 'index.html'))
})

app.get('/balancing', function (req, res) {
  res.sendFile(path.join(publicDir, 'balancing.html'))
})

const server = http.createServer(app)

// Reload code here
reload(app).then(function (reloadReturned) {
  // reloadReturned is documented in the returns API in the README

  // Reload started, start web server
  server.listen(app.get('port'), function () {
    console.log('Web server listening on port ' + app.get('port'))
  })
}).catch(function (err) {
  console.error('Reload could not start, could not start server/sample app', err)
})