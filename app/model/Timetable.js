const { Sequelize, sequelize } = require('../bootstrap/database')

// Timetable 모델 정의
const Timetable = sequelize.define('Timetable', {
  grade: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  class: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  weekday: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  class_time: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  code: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  teacher: {
    type: Sequelize.STRING(12),
    allowNull: false
  },
  subject: {
    type: Sequelize.STRING(36),
    allowNull: false
  }
}, {
  freezeTableName: true
})

exports.init = () => {
  return Timetable.sync({ force: true })
}

exports.get = (grade, classNum, weekday) => {
  return Timetable.findAll({
    where: {
      grade,
      class: classNum,
      weekday
    }
  })
}

exports.update = async timetableData => {
  await Timetable.destroy({
    where: {},
    truncate: true
  })

  for (let d of timetableData) {
    await Timetable.create(d)
  }
}
