const db = uniCloud.database()
const {
	responseCode,
} = require('../../../../common/constants.js')
const {
	validateToken
} = require('../../utils/validateToken.js')
async function setRole(event) {
	const {
		token,
		role
	} = event
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
	let roleUpdateResult = await db.collection('user').where({
		openid
	}).update({
		role: role
	})
	if (roleUpdateResult.affectedDocs === 1) {
		return {
			status: responseCode.success,
			msg: '设置用户角色成功'
		}
	}
	return {
		status: responseCode.failed,
		msg: '设置用户角色失败'
	}
}
exports.main = setRole
