const { Sequelize, sequelize } = require('../bootstrap/database')

// Calendar 모델 정의
const Calendar = sequelize.define('Calendar', {
  month: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  day: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  content: {
    type: Sequelize.STRING(50),
    allowNull: false
  }
}, {
  freezeTableName: true
})

exports.init = () => {
  return Calendar.sync({ force: true })
}

exports.get = () => {
  return Calendar.findAll()
}

exports.update = async datas => {
  await Calendar.destroy({
    where: {},
    truncate: true
  })

  for (let day = 1; day <= 31; day++) {
    if (datas[day]) {
      await Calendar.create({
        month: datas.month,
        day: day,
        content: datas[day]
      })
    }
  }
}
