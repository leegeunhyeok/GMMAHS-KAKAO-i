/**
 * @description 숫자 데이터에 지정한 자릿수만큼 0 추가
 * @param {number} targetNumber 0 추가할 숫자
 * @param {number} length 지정한 길이가 될때까지 원본 숫자에 0 추가
 * @return {string}
 */
const appendZero = (targetNumber, length) => {
  const targetString = targetNumber.toString()
  let zeros = ''
  for (let i = targetString.length; i < length; i++) {
    zeros += '0'
  }
  return zeros + targetString
}

/**
 * @description 현재 시각 문자열로 반환
 * @return {string}
 */
const timeStamp = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = appendZero(date.getMonth() + 1, 2)
  const day = appendZero(date.getDate(), 2)
  const hour = appendZero(date.getHours(), 2)
  const min = appendZero(date.getMinutes(), 2)
  const sec = appendZero(date.getSeconds(), 2)
  const ms = appendZero(date.getMilliseconds(), 3)
  return `${year}-${month}-${day} ${hour}:${min}:${sec}.${ms} `.gray
}

module.exports = {
  appendZero: appendZero,
  timeStamp: timeStamp
}
