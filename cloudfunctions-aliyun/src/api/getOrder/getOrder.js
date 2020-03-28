const {
	responseCode,
	orderState
} = require('../../../../common/constants.js') //查看订单无需登录
const db = uniCloud.database()
async function getOrder(event) {
	const count = event.pageSize
	const page = event.pageNum
	const pageCount = 10
	let type = orderState.initState
	let res = await db.collection('order').where({ //只返回未接单的订单
		type: type
	}).limit(page * pageCount, count).get()

	if (res.data.length > 0) {
		return {
			status: responseCode.success,
			msg: res.data
		}
	} else {
		return {
			status: responseCode.failed,
			msg: '获取订单数据失败'
		}
	}
}


exports.main = getOrder
