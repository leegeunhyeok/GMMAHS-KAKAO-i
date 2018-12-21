const config = require('config')
const Sequelize = require('sequelize')

// sequelize 옵션 및 객체 생성
const sequelize = new Sequelize(
  config.get('database.db'),
  config.get('database.user'),
  config.get('database.password'),
  {
    define: {
      charset: 'utf8'
    },
    host: config.get('database.host'),
    port: config.get('database.port'),
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false
  }
)

exports.init = () => {
  // Database 인증 시도
  return sequelize.authenticate()
}

exports.Sequelize = Sequelize
exports.sequelize = sequelize
