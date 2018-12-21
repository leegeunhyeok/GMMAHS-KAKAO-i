const { Sequelize, sequelize } = require('../bootstrap/database')

// Weather 모델 정의
const Weather = sequelize.define('Weather', {
  _index: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  hour: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  temp: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  pty: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  pop: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  wfKor: {
    type: Sequelize.STRING,
    allowNull: false
  },
  reh: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  pub: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true
})

exports.init = () => {
  return Weather.sync({ force: true })
}

exports.get = () => {
  return Weather.findAll()
}

exports.update = async weatherInfo => {
  await Weather.destroy({
    where: {},
    truncate: true
  })

  let _index = 0
  for (let weather of weatherInfo) {
    await Weather.create({
      _index,
      hour: weather.hour,
      temp: weather.temp,
      pty: weather.pty,
      pop: weather.pop,
      wfKor: weather.wfKor,
      reh: weather.reh,
      pub: weather.pub
    })
    _index++
  }
}
