const request = require('request')
const iconv = require('iconv-lite')

const { timeStamp, appendZero } = require('../common/util')
const TimetableModel = require('../model/Timetable')

var Timetable = {}

Timetable._baseUrl = 'http://comci.kr:4081'
Timetable._url = 'http://comci.kr:4081/st'
Timetable._weekdayString = ['일', '월', '화', '수', '목', '금', '토']
Timetable._numberEmoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']

Timetable.init = async function (schoolKeyword) {
  this._school = schoolKeyword
  await TimetableModel.init()
  console.log(timeStamp() + 'Timetable model defined'.cyan)
}

Timetable.update = async function () {
  try {
    const result = await new Promise((resolve, reject) => {
      request(this._url, (err, res, body) => {
        if (err) {
          reject(new Error('Can not load school information'))
        }

        // 검색할 문자열 인덱스 조회
        const idx = body.indexOf('school_ra(sc)')
        const idx2 = body.indexOf('sc_data(\'')

        if (idx === -1 || idx2 === -1) {
          reject(new Error('Can not find keyword to extract from source'))
        }

        // school_ra의 접근 코드 추출
        const extractSchoolRa = body.substr(idx, 50).replace(' ', '')
        const schoolRa = extractSchoolRa.match(/url:'.(.*?)'/)

        // sc_data 인자값 추출
        const extractScData = body.substr(idx2, 30).replace(' ', '')
        const scData = extractScData.match(/\(.*?\)/)

        if (scData) {
          this.scData = scData[0].replace(/[()]/g, '').replace(/'/g, '').split(',')
        }

        if (schoolRa) {
          this.extractCode = schoolRa[1]
          let hexString = ''
          for (let buf of iconv.encode(this._school, 'euc-kr')) {
            hexString += '%' + buf.toString(16)
          }

          request(this._baseUrl + this.extractCode + hexString, (err, res, body) => {
            let jsonString = body.substr(0, body.lastIndexOf('}') + 1)
            let searchData = JSON.parse(jsonString)['학교검색']
            if (err) {
              reject(new Error('Can not extract school code'))
            } else if (searchData.length > 1) {
              reject(new Error('Too many school results. Enter more details'))
            } else {
              const da1 = '0'
              const s7 = this.scData[0] + searchData[0][3]
              const sc3 = this.extractCode.split('?')[0] + '?' +
                          Buffer.from(s7 + '_' + da1 + '_' + this.scData[2]).toString('base64')

              request(this._baseUrl + sc3, (err, res, body) => {
                if (err || !body) {
                  reject(new Error('Can not find timetable data'))
                }
                resolve(JSON.parse(body.substr(0, body.lastIndexOf('}') + 1)))
              })
            }
          })
        } else {
          reject(new Error('Can not extract url'))
        }
      })
    })

    let subjectProp = ''
    let teacherProp = ''
    let timedataProp = ''

    for (let k of Object.keys(result)) {
      if (typeof result[k] === 'object' && k.indexOf('자료') !== -1) {
        if (k.indexOf('긴') !== -1) {
          subjectProp = k
        } else {
          try {
            let teacherCount = 0
            let teacherFinished = false
            let timetableDataFinished = false
            for (let d of result[k]) {
              if ((d.indexOf('김') !== -1 || d.indexOf('박') !== -1 || d.indexOf('이') !== -1 || d.indexOf('송') !== -1)) {
                teacherCount++
              }

              if (teacherCount >= 10 && !teacherFinished) {
                teacherProp = k
                teacherFinished = true
              }

              for (let dd of d) {
                if (dd.length === 7 && typeof dd[0] === 'object') {
                  timedataProp = k
                  break
                }
              }

              if (teacherFinished && timetableDataFinished) {
                break
              }
            }
          } catch (e) {
            console.log(timeStamp() + e.message.red)
          }
        }
      }
    }

    const classCount = result['학급수']
    const teachers = result[teacherProp]
    const subjects = result[subjectProp]
    const data = result[timedataProp]
    const time = result['요일별시수']

    // 저장 데이터 리스트
    let insertData = []

    // 1학년 ~ 3학년 교실 반복
    for (let grade = 1; grade <= 3; grade++) {
      // 학년 별 반 수 만큼 반복
      for (let classNum = 1; classNum <= classCount[grade]; classNum++) {
        const tempData = data[grade][classNum]
        // 월(1) ~ 금(5)
        for (let weekday = 1; weekday <= 5; weekday++) {
          // 1교시 ~ 해당 날짜의 수업 교시
          for (let classTime = 1; classTime <= time[grade][weekday]; classTime++) {
            const code = tempData[weekday][classTime].toString()
            var teacherCode = 0
            var subjectCode = 0

            if (code.length === 3) {
              teacherCode = parseInt(appendZero(code.substr(0, 1), 2))
              subjectCode = parseInt(appendZero(code.substr(1, 2), 2))
            } else {
              teacherCode = parseInt(appendZero(code.substr(0, 2), 2))
              subjectCode = parseInt(appendZero(code.substr(2, 2), 2))
            }

            insertData.push({
              grade,
              class: classNum,
              weekday,
              class_time: classTime,
              code,
              teacher: teachers[teacherCode],
              subject: subjects[subjectCode].replace(/_/g, '')
            })
          }
        }
      }
    }

    await TimetableModel.update(insertData)
    console.log(timeStamp() + 'Timetable data updated'.green)
  } catch (e) {
    console.log(e)
    console.log(timeStamp() + e.message.red)
  }
}

Timetable.get = async function (grade, classNum, weekday) {
  try {
    const rows = await TimetableModel.get(grade, classNum, weekday)
    if (rows.length > 0) {
      let timetableResult = `📅 ${grade}학년 ${classNum}반 ${this._weekdayString[weekday]}요일 시간표\n\n`
      for (let row of rows) {
        let data = row.dataValues
        timetableResult += `${this._numberEmoji[data.class_time - 1]}교시 - ${data.subject} (${data.teacher})\n`
      }
      return timetableResult.replace(/\n$/, '')
    } else {
      return '시간표 정보가 없습니다.'
    }
  } catch (e) {
    console.log(timeStamp() + e.message.red)
    return '시간표 데이터를 불러오는 중 문제가 발생했습니다.'
  }
}

module.exports = Timetable
