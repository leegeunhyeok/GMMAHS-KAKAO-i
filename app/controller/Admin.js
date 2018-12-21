const config = require('config')

const { timeStamp } = require('../common/util')
const AdminModel = require('../model/Admin')

var Admin = {}

Admin.init = async () => {
  const id = config.get('admin.id')
  const password = config.get('admin.password')
  await AdminModel.init(id, password)
  console.log(timeStamp() + 'Admin model defined'.cyan)
  console.log(timeStamp() + 'Initial admin account created '.cyan + `${id}/${password}`.blue)
}

Admin.auth = async (user) => {
  try {
    return await AdminModel.auth(user)
  } catch (e) {
    console.log(timeStamp() + e.message.red)
    return false
  }
}

Admin.create = async (user) => {
  try {
    await AdminModel.create(user)
    console.log(timeStamp() + 'New admin account created'.yellow)
  } catch (e) {
    console.log(timeStamp() + e.message.red)
  }
}

Admin.delete = async (user) => {
  try {
    await AdminModel.delete(user)
    console.log(timeStamp() + `Admin account was deleted. id: ${user.id}`.yellow)
  } catch (e) {
    console.log(timeStamp() + e.message.red)
  }
}

Admin.list = async () => {
  try {
    return await AdminModel.list()
  } catch (e) {
    console.log(timeStamp() + e.message.red)
  }
}

Admin.update = async (user) => {
  try {
    const affectedRow = await AdminModel.update(user)
    if (affectedRow) {
      console.log(timeStamp() + 'Admin password was not changed. Check id'.yellow)
    } else {
      console.log(timeStamp() + 'Admin password changed.'.yellow)
    }
  } catch (e) {
    console.log(timeStamp() + e.message.red)
  }
}

module.exports = Admin
