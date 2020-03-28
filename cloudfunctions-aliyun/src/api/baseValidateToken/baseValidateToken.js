const jwt = require('jwt-simple')
//根据token验证  成功则返回openid 以及userid
const db = uniCloud.database()
async function validateToken(token) {
  const userFromToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  const userInDB = await db.collection('user').where(userFromToken).get()
  if (userInDB.data.length !== 1) {
    return {
      status: -1,
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
      status: 0,
      openid: userInfoDB.openid,
      userId: userInfoDB.userId,
      msg: 'token验证成功'
    }
  }

  if (userInfoDB.exp < Date.now()) {
    return {
      status: -3,
      msg: 'token已失效'
    }
  }

  return {
    status: -2,
    msg: 'token无效'
  }

}

module.exports = {
  validateToken
}
