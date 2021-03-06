const config = require('config')
const statistics = require('../controller/Statistics')
const controller = require('../controller/Calendar')

const routerName = config.get('proxy') + '/calendar'

module.exports = app => {
  app.post(routerName, async (req, res) => {
    await statistics.count('CALENDAR')
    const calendarData = await controller.get()

    res.json({
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: '📅 이번 달 학사일정입니다!'
            }
          },
          {
            simpleText: {
              text: calendarData
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
