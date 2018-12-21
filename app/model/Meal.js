const { Sequelize, sequelize } = require('../bootstrap/database')

// Meal 모델 정의
const Meal = sequelize.define('Meal', {
  date: {
    type: Sequelize.STRING,
    allowNull: false
  },
  info: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true
})

exports.init = () => {
  return Meal.sync({ force: true })
}

exports.get = type => {
  return Meal.findOne({
    where: {
      type: type
    }
  })
}

exports.update = async (mealInfos) => {
  await Meal.destroy({
    where: {},
    truncate: true
  })

  mealInfos.forEach(async meal => {
    await Meal.create({
      date: meal.date,
      info: meal.info,
      type: meal.type
    })
  })
}
