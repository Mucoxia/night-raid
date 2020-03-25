const crypto = require('crypto')
const jwt = require('jwt-simple')
const {
  wxConfig,
  tokenExp
} = require('../../../../common/constants.js')

const db = uniCloud.database()

async function login(event) {
  let data = {
    appid: wxConfig.appid,
    secret: wxConfig.appSecret,
    js_code: event.code,
    grant_type: 'authorization_code'
  }

  const res = await uniCloud.httpclient.request('https://api.weixin.qq.com/sns/jscode2session', { //调用微信的登录凭证校验
    method: 'GET',
    data,
    dataType: 'json'
  })

  const success = res.status === 200 && res.data && res.data.openid//获取用户的唯一标识
  if (!success) {
    return {
      status: -1,
      msg: '微信登录失败'
    }
  }

  const {
    openid,
    //session_key 暂不需要session_key
  } = res.data

  let userInfo = {
    openid
  }

  let tokenSecret = crypto.randomBytes(16).toString('hex'),
    token = jwt.encode(userInfo, tokenSecret)

  const userInDB = await db.collection('user').where({
    openid
  }).get()

  let userUpdateResult
  if (userInDB.data && userInDB.data.length === 0) {//如果用户表没有获得的唯一标识 就插入
    userUpdateResult = await db.collection('user').add({
      ...userInfo,
      tokenSecret,
      exp: Date.now() + tokenExp
    })
  } else {
    userUpdateResult = await db.collection('user').doc(userInDB.data[0]._id).set({
      ...userInfo,
      tokenSecret,
      exp: Date.now() + tokenExp
    })
  }

  if (userUpdateResult.id || userUpdateResult.updated === 1) {
    return {
      status: 0,
      token,
	  userInfo,
      msg: '登录成功'
    }
  }

  return {
    status: -1,
    msg: '微信登录失败'
  }
}

exports.main = login
