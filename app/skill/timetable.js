const statistics = require('../controller/Statistics')
const controller = require('../controller/Timetable')

const routerName = '/timetable'

module.exports = app => {
  app.post(routerName, async (req, res) => {
    await statistics.count('TIMETABLE')
    const params = req.body.action['params'] || {}
    const date = JSON.parse(params['sys_date'] || '{}')
    const dateString = date['date']
    const targetDate = new Date(dateString)
    const day = targetDate.getDay()

    const gradeParam = JSON.parse(params['grade'] || '{}')
    const classParam = JSON.parse(params['class'] || '{}')

    const gradeNum = gradeParam['amount'] || 0
    const classNum = classParam['amount'] || 0

    const timetableData = await controller.get(gradeNum, classNum, day)

    res.json({
      version: '2.0',
      template: {
        outputs: [
          {
            simpleText: {
              text: timetableData
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
