const db = uniCloud.database()
async function report(event) {
  try {
    return await uniCloud.callFunction({
    name: "baseValidateToken",
    data: { event }
})
  } catch (e) {
    //TODO handle the exception
    return {
      status: -2,
      errCode: 'TOKEN_INVALID',
      msg: 'token无效'
    }
  }
};

exports.main = report
