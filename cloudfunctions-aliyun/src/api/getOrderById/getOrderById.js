const {
	validateToken
} = require('../../utils/validateToken.js')

const {
	responseCode,
	orderState
} = require('../../../../common/constants.js')
const db = uniCloud.database()
async function getOrderById(event) {//获取用户创建的订单数据  传入用户的openid
	const token = event.token
	let openid = event.openid
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

	let res = await db.collection('order').where({//查找已接单状态订单
	  maintainer_id: openid,
	  type: orderState.received
	}).get()
	
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


exports.main = getOrderById
