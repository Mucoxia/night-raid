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
    password
  } = event

  let userInfo = {
    userId
  }

  const userInDB = await db.collection('user').where(userInfo).get()

  let tokenSecret = crypto.randomBytes(16).toString('hex'),
    token = jwt.encode(userInfo, tokenSecret)
  let userUpdateResult
  if (userInDB.data && userInDB.data.length === 0) {
    userUpdateResult = await db.collection('user').add({
      ...userInfo,
      password: encryptPassword(password),
      tokenSecret,
      exp: Date.now() + tokenExp
    })
  } else {
    return {
      status: -1,
      msg: '此用户ID已存在'
    }
  }

  if (userUpdateResult.id || userUpdateResult.affectedDocs === 1) {
    return {
      status: 0,
      token,
      msg: '注册成功'
    }
  }

  return {
    status: -1,
    msg: '注册失败'
  }
}

exports.main = signUp
