const config = require('config')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')

const bus = require('../src/Bus')

const admin = require('../controller/Admin')
const calendar = require('../controller/Calendar')
const meal = require('../controller/Meal')
const statistics = require('../controller/Statistics')
const timetable = require('../controller/Timetable')
const weather = require('../controller/Weather')

const mealSkill = require('../skill/meal')

const { timeStamp } = require('../common/util')
const school = require('./school').school

const sessionOption = {
  secret: 'test_key',
  resave: true,
  saveUninitialized: true
}

module.exports = async (app, express) => {
  const startTime = new Date()
  console.log(timeStamp() + 'Server initializing..')

  await require('./database').init()

  await admin.init()
  await bus.init()
  await calendar.init(school)
  await meal.init(school)
  await statistics.init()
  await timetable.init('광명경영회계고등학교')
  await weather.init()

  // await calendar.update()
  await meal.update()
  // await timetable.update()
  // await weather.update()

  await require('./scheduler').init()

  // 포트 설정, 기본값 8080
  app.set('port', config.has('port') ? config.get('port') : 8080)

  // 미들웨어 사용
  app.use('/', express.static('public'))

  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(session(sessionOption))

  app.use(passport.initialize())
  app.use(passport.session())

  await mealSkill(app)
  require('../route/admin')(app)

  console.log(timeStamp() + 'Initialization complete! ' + (new Date() - startTime + 'ms').yellow)
}
