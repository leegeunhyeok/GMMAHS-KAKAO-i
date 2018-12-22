const controller = require('../controller/Statistics')

const routerName = '/statistics'

module.exports = app => {
  app.post(routerName, async (req, res) => {
    const statData = await controller.get()
    res.json({
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: '여러분들이 사용한 메뉴의 사용량 통계입니다! 😃'
            }
          },
          {
            simpleText: {
              text: statData
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
