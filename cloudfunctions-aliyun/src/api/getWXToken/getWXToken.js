const {
	wxConfig,
	tokenExp
} = require('../../../../common/constants.js')

async function login(event) {
	let data = {
		appid: wxConfig.appid,
		secret: wxConfig.appSecret,
	}
	const res = await uniCloud.httpclient.request(
		'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET', { //获取小程序全局唯一后台接口调用凭据（access_token）
			method: 'GET',
			data,
			dataType: 'json'
		})
	const success = res.errCode === 200 && res.data && res.data.access_token
	if (!success) {
		return {
			status: -1,
			msg: '获取微信token失败'
		}
	}
	const {
		access_token,
		expires_in
	} = res.data
	let tokenData = {
		access_token,
		expires_in
	}

	let result = await collection.doc('wx_access_token').set({
		...tokenData,
		id: "1",
	})
	if (result.affectedDocs === 1) {
		return {
			status: 0,
			msg: '获取token成功'
		}
	}
	return {
		status: -1,
		msg: '获取token失败'
	}
}
