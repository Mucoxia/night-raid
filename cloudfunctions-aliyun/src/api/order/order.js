const {
	validateToken
} = require('../../utils/validateToken.js')

const db = uniCloud.database()
async function order(event) {
	const token = event.token
	const id = event.id
	const formdata = JSON.parse(event.data)
	const address = formdata.address
	const name = formdata.name
	const phone = formdata.phone
	const detail = formdata.detail
	const device = formdata.device

	let validateResult
	try {
		validateResult = await validateToken(token)
	} catch (e) {
		return {
			status: -2,
			msg: 'token无效'
		}
	}
	if (validateResult.status !== 0) {
		return validateResult
	}
	let openid = validateResult.openid
	let order_no = createTimeStamp() + createRandomStr()
	let type = 0 //未接单状态
	let duration = ''
	let time = ''
	let repairer_id = id //保修者id


	let res = await db.collection('order').add({
		order_no,
		type,
		duration,
		time,
		detail,
		repairer_id,
		address,
		phone,
		device,
		name
	})

	if (res.id) {
		return {
			status: 0,
			order_no
		}
	} else {
		return {
			status: 1000,
			msg: '订单创建失败'
		}
	}
}

// 随机字符串产生函数
function createRandomStr() {
	return Math.random().toString(36).substr(2, 15)
}

// 时间戳产生函数
function createTimeStamp() {
	return Date.now() + ''
}

exports.main = order
