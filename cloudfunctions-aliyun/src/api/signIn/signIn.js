const crypto = require('crypto')
const jwt = require('jwt-simple')
const {
  tokenExp
} = require('../../../../common/constants.js')
const {
  encryptPassword
} = require('../../../../utils/encryptPassword.js')

const db = uniCloud.database()

async function signUp(event) {
  const {
    userId,
    password,
  } = event

  let userInfo = {
    userId
  }

  const userInDB = await db.collection('user').where({
    userId,
    password: encryptPassword(password)
  }).get()

  let tokenSecret = crypto.randomBytes(16).toString('hex'),
    token = jwt.encode(userInfo, tokenSecret)
  let userUpdateResult
  if (userInDB.data && userInDB.data.length === 0) {
    return {
      status: -1,
      msg: '用户名或密码不正确'
    }
  } else {
    userUpdateResult = await db.collection('user').doc(userInDB.data[0]._id).update({//成功登陆更新新的密钥
      tokenSecret,
      exp: Date.now() + tokenExp
    })
  }

  if (userUpdateResult.id || userUpdateResult.affectedDocs === 1) {
    return {
      status: 0,
      token,
      msg: '登录成功'
    }
  }

  return {
    status: -1,
    msg: '登录失败'
  }
}

exports.main = signUp
