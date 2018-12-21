const passport = require('passport')
const { Strategy } = require('passport-local')
const { timeStamp } = require('../common/util')

const Admin = require('../controller/Admin')

// Passport 전략 정의
passport.use(new Strategy(
  {
    usernameField: 'id',
    passwordField: 'password',
    session: true
  },
  (id, password, done) => {
    const user = { id, password }
    Admin.auth(user).then(auth => {
      if (auth) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }
))

// 로그인 성공 시 유저 정보 직렬화
passport.serializeUser((user, done) => {
  done(null, user)
})

// 로그인 후 인증 진행 시 호출됨
passport.deserializeUser((user, done) => {
  done(null, user)
})

// 로그인 진행
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.json({ login: false })
    }

    req.logIn(user, err => {
      if (err) {
        return res.json({ login: false })
      }
      return res.json({ login: true })
    })
  })(req, res, next)
}

// 로그아웃
exports.logout = (req, res) => {
  req.logout()
  res.redirect('/admin')
}

// 인증 상태 확인
exports.authenticate = (req, res) => {
  console.log(timeStamp() + 'Authenticated: ' + (req.isAuthenticated() ? 'true'.green : 'false'.red))
  res.json({ auth: req.isAuthenticated() })
}

exports.auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.writeHead(401, { 'Content-Type': 'text/html' })
  res.write('Login please')
  res.end()
}

exports.passport = passport
