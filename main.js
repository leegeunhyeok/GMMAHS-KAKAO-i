const express = require('express')
const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/test', (req, res) => {
  console.log(req.body)
  res.json({
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: {
            text: 'Test message'
          }
        }
      ]
    }
  })
})

app.listen(80, () => {
  console.log('Server started')
})
