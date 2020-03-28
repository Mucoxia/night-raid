const wxConfig = {
  appid: '', //微信小程序AppId
  appSecret: '', //微信小程序AppSecret
  mchid: '', // 商户号
  partnerKey: '' // key为商户平台设置的密钥key
}

const passSecret = '' //用于用户数据库密码加密的密钥，使用一个比较长的随机字符串即可

//上面的字段非常重要！！！

const tokenExp = 7200000
//订单状态码
const orderState = {
	initState: 0,//刚刚创建完成
	received:1,//已接单状态
	closed:2,//订单维修完成后关闭状态
	refused:3,//订单被拒绝
	service:4//维修中
}
//响应码
const responseCode = {
	success:200,//成功响应
	needCertification:401,//token验证失败 需要认证
	notFound:404,//资源未找到
	failed:201,//失败响应
}
module.exports = {
  wxConfig,
  passSecret,
  tokenExp,
  orderState,
  responseCode
}
