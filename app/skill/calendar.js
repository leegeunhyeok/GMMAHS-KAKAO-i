const controller = require('../controller/Calendar')

const routerName = '/calendar'

module.exports = app => {
  app.post(routerName, async (req, res) => {
    const calendarData = await controller.get()

    res.json({
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: '📅 이번 달 학사일정입니다!'
            },
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