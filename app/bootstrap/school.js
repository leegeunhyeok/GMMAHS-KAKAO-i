const config = require('config')
const School = require('node-school-kr')
const school = new School()

school.init(School.Type.HIGH, School.Region.GYEONGGI, config.get('schoolCode'))

exports.school = school
