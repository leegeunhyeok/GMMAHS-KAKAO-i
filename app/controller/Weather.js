const request = require('request')
const cheerio = require('cheerio')

const { timeStamp } = require('../common/util')
const WeatherModel = require('../model/Weather')

var Weather = {}

Weather._url = 'http://www.weather.go.kr/wid/queryDFSRSS.jsp?zone=4121065000'
Weather._pty = ['없음', '비', '비와 눈', '눈']

Weather.init = async function () {
  await WeatherModel.init()
  console.log(timeStamp() + 'Weather model defined'.cyan)
}

Weather.update = async function () {
  const result = await new Promise((resolve, reject) => {
    request(this._url, (err, res, body) => {
      if (err) {
        reject(err)
      }

      const $ = cheerio.load(body)
      const pub = $('pubDate').text().replace(/^[0-9]{4}[년] /, '')
      const weather = []

      for (let i = 2; i <= 4; i++) {
        let obj = {}
        let data = $(`data:nth-child(${i})`)
        obj['index'] = i - 2
        obj['hour'] = data.find('hour').text() // 시간
        obj['temp'] = data.find('temp').text() // 기온
        obj['pty'] = data.find('pty').text() // 강수형태(0: 없음, 1: 비, 2: 비/눈, 3: 눈)
        obj['pop'] = data.find('pop').text() // 강수확률
        obj['wfKor'] = data.find('wfKor').text() // 하늘 상태(맑음..등)
        obj['reh'] = data.find('reh').text() // 습도
        obj['pub'] = pub
        weather.push(obj)
      }
      resolve(weather)
    })
  })
  await WeatherModel.update(result)
  console.log(timeStamp() + 'Weather data updated'.green)
}

Weather.get = async function () {
  try {
    const rows = await WeatherModel.get()
    if (rows) {
      let resultString = ''
      const pub = rows[0].pub
      rows.forEach(row => {
        resultString += `[${row.hour > 12 ? '오후' : '오전'}` +
                        ` ${row.hour > 12 ? row.hour - 12 : row.hour}시]\n` +
                        `- 기온: ${row.temp}℃\n` +
                        `- 강수형태: ${this._pty[row.pty]}\n` +
                        `- 강수확률: ${row.pop}%, ${row.wfKor}\n` +
                        `- 습도: ${row.reh}%\n\n`
      })
      return resultString + pub + ' 발표\n소하 2동 날씨 기준'
    } else {
      return '날씨 데이터가 없습니다.'
    }
  } catch (e) {
    console.log(timeStamp() + e.message.red)
    return '날씨 데이터를 불러오는 중 문제가 발생했습니다.'
  }
}

module.exports = Weather
