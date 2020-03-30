const {
	responseCode,
	orderState
} = require('../../../../common/constants.js') //查看订单无需登录
const db = uniCloud.database()
async function getOrder(event) {
	const pageSize = event.pageSize
	const pageNum = event.pageNum
	let type = orderState.initState
	let start = pageNum*pageSize
	let res = await db.collection('order').where({type:type}).skip(start).limit(pageSize).get()

	if (res.data&&res.data.length > 0) {
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
