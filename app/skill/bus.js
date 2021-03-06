const config = require('config')
const statistics = require('../controller/Statistics')
const controller = require('../src/Bus')

const routerName = config.get('proxy') + '/bus'

module.exports = app => {
  app.post(routerName, async (req, res) => {
    await statistics.count('BUS')
    const params = req.body.action['params'] || {}
    const keyword = params['sys_text'] || ''
    const busData = await controller.search(keyword)

    res.json({
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: `🚏 ${keyword} 정류장 도착 정보입니다!`
            }
          },
          {
            simpleText: {
              text: busData
            }
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
