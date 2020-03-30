const {
	validateToken
} = require('../../utils/validateToken.js')

const {
	responseCode,
	orderState
} = require('../../../../common/constants.js')
const db = uniCloud.database()
async function getOrderById(event) { 
	const token = event.token
	const pageSize = event.pageSize
	const pageNum = event.pageNum
	const role = event.role
	let start = pageNum * pageSize
	let validateResult
	try {
		validateResult = await validateToken(token)
	} catch (e) {
		return {
			status: responseCode.needCertification,
			msg: 'token无效'
		}
	}
	if (validateResult.status !== 0) {
		return validateResult
	}
	let openid = validateResult.openid
	if (role == 0) {
		let res = await db.collection('order').where({
			repairer_id: openid
		}).skip(start).limit(pageSize).get()
	} else if (role == 1) {
		let res = await db.collection('order').where({ //查找已接单状态订单
			maintainer_id: openid,
			type: orderState.received
		}).skip(start).limit(pageSize).get()
	}
	if (res.data && res.data.length > 0) {
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


exports.main = getOrderById
