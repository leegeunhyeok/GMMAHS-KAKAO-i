const controller = require('../src/Bus')

const routerName = '/bus'

module.exports = app => {
  app.post(routerName, async (req, res) => {
    const params = req.body.action['params'] || {}
    const type = JSON.parse(params['sys_text'] || '{}')
    const busData = await controller.search(type['dateTag'])
    console.log(JSON.stringify(params, null, 2))

    res.json({
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: busData
            },
          }
        ],
        quickReplies: [
          {
            label: '메뉴 보기',
            action: 'message',
            messageText: '메뉴 보기'
          }
        ]
      }
    })
  })
}