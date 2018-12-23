const config = require('config')
const statistics = require('../controller/Statistics')
const controller = require('../controller/Weather')

const routerName = config.get('proxy') + '/weather'

module.exports = app => {
  app.post(routerName, async (req, res) => {
    await statistics.count('WEATHER')
    const weatherData = await controller.get()

    res.json({
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: '🌈 기상청 날씨 정보입니다!'
            }
          },
          {
            simpleText: {
              text: weatherData
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
