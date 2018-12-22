const controller = require('../controller/Meal')

const routerName = '/meal'

module.exports = app => {
  app.post(routerName, async (req, res) => {
    const params = req.body.action['params'] || {}
    const type = JSON.parse(params['sys_date'] || '{}')
    const mealData = await controller.get(type['dateTag'])

    let typeString = '🍚 오늘의 급식을 알려드릴게요!'
    if (type['dateTag'] === 'tomorrow') {
      typeString = '🍚 내일의 급식을 알려드릴게요!'
    } else if (type['dateTag'] === 'yesterday') {
      typeString = '지난 급식 정보는 제공하지 않아요..😭\n대신 오늘의 급식을 알려드릴게요!'
    }

    res.json({
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: typeString
            },
          },
          {
            simpleText: {
              text: mealData
            }
          }
        ],
        quickReplies: [
          {
            label: '이번 달 급식도 볼래요',
            action: 'message',
            messageText: '이번 달 급식'
          }
        ]
      }
    })
  })
}