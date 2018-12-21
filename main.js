const express = require('express')
const app = express()

const bodyParser = require('body-parser')

const colors = require('colors')

const { timeStamp } = require('./app/common/util')

require('./app/bootstrap/init')(app, express).then(() => {
  app.listen(app.get('port'), () => {
    console.log(timeStamp() + colors.rainbow('GMMAHS KAKAO server started, port: ' + app.get('port')))
  })
}).catch(e => {
  console.log(timeStamp() + 'Server initialization error: ' + e.message.red)
})

process.on('uncaughtException', e => {
  console.log(timeStamp() + ('UncaughtException: ' + e.message).red)
})
