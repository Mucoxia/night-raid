const {
	validateToken
} = require('../../utils/validateToken.js')

const db = uniCloud.database()
async function getOrder(event) {
	//const token = event.token
	const count = event.pageSize
	const page = event.pageNum
	const pageCount = 10
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


exports.main = getOrder
