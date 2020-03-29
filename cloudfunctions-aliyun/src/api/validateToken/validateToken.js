const db = uniCloud.database()
const {
	responseCode,
} = require('../../../../common/constants.js')
async function report(event) {
  try {
    return await uniCloud.callFunction({
    name: "baseValidateToken",
    data: { event }
})
  } catch (e) {
    //TODO handle the exception
    return {
      status: responseCode.needCertification,
      errCode: 'TOKEN_INVALID',
      msg: 'token无效'
    }
  }
};

exports.main = report
