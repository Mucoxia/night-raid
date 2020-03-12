'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const db = uniCloud.database();
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
}
var main = report;

var validateToken = {
	main: main
};

exports.default = validateToken;
exports.main = main;
