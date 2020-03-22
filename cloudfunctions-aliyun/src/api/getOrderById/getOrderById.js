const {
	validateToken
} = require('../../utils/validateToken.js')

const db = uniCloud.database()
async function getOrderById(event) {//获取用户创建的订单数据  传入用户的openid
	//const token = event.token
	let openid = event.openid
	let validateResult
	// try {
	// 	validateResult = await validateToken(token)
	// } catch (e) {
	// 	return {
	// 		status: -2,
	// 		msg: 'token无效'
	// 	}
	// }
	// if (validateResult.status !== 0) {
	// 	return validateResult
	// }

	let res = await db.collection('order').limit(page * pageCount, count).get()
	
	if (res.data.length > 0) {
		return {
			status: 200,
			msg: res.data
		}
	} else {
		return {
			status: 401,
			msg: '获取订单数据失败'
		}
	}
}


exports.main = getOrderById
