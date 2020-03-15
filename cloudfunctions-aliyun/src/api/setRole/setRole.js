const db = uniCloud.database()
async function setRole(event) {
	const{
		token,
		role
	}=event
	const userFromToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
	let roleUpdateResult = await db.collection('user').doc(userFromToken.userId).update({
	  role: role,
	})
	if (roleUpdateResult.affectedDocs === 1) {
	  return {
	    status: 0,
	    token,
	    msg: '设置用户角色成功'
	  }
	}
	return {
	  status: -1,
	  msg: '设置用户角色失败'
	}
}
exports.main = setRole

