const jwt = require('jwt-simple')
const {
	responseCode,
} = require('../../../common/constants.js') 
const db = uniCloud.database()
async function validateToken(token) {
  const userFromToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  const userInDB = await db.collection('user').where(userFromToken).get()
  if (userInDB.data.length !== 1) {
    return {
      status: responseCode.failed,
      msg: '查无此人'
    }
  }
  const userInfoDB = userInDB.data[0]
  let userInfoDecode

  userInfoDecode = jwt.decode(token, userInfoDB.tokenSecret)

  function checkUser(userFromToken, userInfoDB) {
    return Object.keys(userFromToken).every(function(item) {
      return userFromToken[item] === userInfoDB[item] && userFromToken[item] === userInfoDecode[item]
    })
  }


  if (userInfoDB.exp > Date.now() && checkUser(userFromToken, userInfoDB)) {
    return {
      status: responseCode.success,
      openid: userInfoDB.openid,
      userId: userInfoDB.userId,
      msg: 'token验证成功'
    }
  }

  if (userInfoDB.exp < Date.now()) {
    return {
      status: responseCode.needCertification,
      msg: 'token已失效'
    }
  }

  return {
    status: responseCode.needCertification,
    msg: 'token无效'
  }

}

module.exports = {
  validateToken
}
