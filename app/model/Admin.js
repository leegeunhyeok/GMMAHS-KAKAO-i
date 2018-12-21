const bcrypt = require('bcrypt')

const { Sequelize, sequelize } = require('../bootstrap/database')

const hashPassword = (admin) => {
  if (!admin.changed('password')) {
    return
  }
  const salt = bcrypt.genSaltSync(8)
  return bcrypt.hash(admin.password, salt).then(hash => {
    admin.password = hash
    admin.salt = salt
  })
}

// Admin 모델 정의
const Admin = sequelize.define('Admin', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  password: {
    type: Sequelize.STRING
  },
  salt: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true,
  hooks: {
    beforeCreate: hashPassword,
    beforeUpdate: hashPassword
  }
})

exports.init = async (id, password) => {
  Admin.prototype.validPassword = async function (password) {
    const valid = await bcrypt.compare(password, this.password)
    return valid
  }
  await Admin.sync({ force: true })
  await Admin.create({ id, password })
}

exports.auth = user => {
  return new Promise(resolve => {
    Admin.findOne({
      where: {
        id: user.id
      }
    }).then(async admin => {
      if (!admin) {
        resolve(false)
      } else if (await admin.validPassword(user.password)) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

exports.create = user => {
  return Admin.create(user)
}

exports.delete = user => {
  return Admin.destroy({
    where: {
      id: user.id
    }
  })
}

exports.list = () => {
  return Admin.findAll()
}

exports.update = admin => {
  return Admin.update({
    password: admin.password
  }, {
    individualHooks: true,
    where: {
      id: admin.id
    }
  })
}
