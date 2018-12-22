const { timeStamp } = require('../common/util')
const StatisticsModel = require('../model/Statistics')

var Statistics = {}

Statistics.type = {
  MEAL: 'meal',
  TIMETABLE: 'timetable',
  CALENDAR: 'calendar',
  WEATHER: 'weather',
  BUS: 'bus'
}

Statistics.init = async function () {
  await StatisticsModel.init()
  console.log(timeStamp() + 'Statistics model defined'.cyan)
}

Statistics.reset = async function () {
  await StatisticsModel.reset()
  console.log(timeStamp() + 'Statistics data cleared'.yellow)
}

Statistics.count = async function (type = 'OTHER') {
  try {
    if (this.type[type]) {
      await StatisticsModel.count(this.type[type])
    }
  } catch (e) {
    console.log(timeStamp() + e.message.red)
  }
}

Statistics.get = async function () {
  try {
    const stat = await StatisticsModel.get()
    if (stat) {
      const total = stat['meal'] +
                    stat['timetable'] +
                    stat['calendar'] +
                    stat['weather'] +
                    stat['bus']

      return `🍚 급식: ${(stat['meal'] / total * 100).toFixed(2)}%\n` +
             `📘 시간표: ${(stat['timetable'] / total * 100).toFixed(2)}%\n` +
             `📅 학사일정: ${(stat['calendar'] / total * 100).toFixed(2)}%\n` +
             `⛅ 날씨: ${(stat['weather'] / total * 100).toFixed(2)}%\n` +
             `🚌 버스: ${(stat['bus'] / total * 100).toFixed(2)}%\n` +
             `✔️ 전체 기능 요청 수: ${total}회\n`
    } else {
      return '통계 데이터가 없습니다.'
    }
  } catch (e) {
    console.log(timeStamp() + e.message.red)
    return '통계 데이터를 불러오는 중 문제가 발생했습니다.'
  }
}

Statistics.getData = async function () {
  try {
    const stat = await StatisticsModel.get()
    if (stat) {
      const data = []
      data.push(stat['meal'])
      data.push(stat['timetable'])
      data.push(stat['calendar'])
      data.push(stat['weather'])
      data.push(stat['bus'])
      data.push(stat['other'])
      return data
    }
  } catch (e) {
    console.log(timeStamp() + e.message.red)
    return [1, 1, 1, 1, 1, 1]
  }
}

module.exports = Statistics
