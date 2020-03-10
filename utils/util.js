const crypto = require('crypto');

exports.md5 = (str, encoding = 'utf8') => crypto.createHash('md5').update(str, encoding).digest('hex');
exports.sha256 = (str, key, encoding = 'utf8') => crypto.createHmac('sha256', key).update(str, encoding).digest('hex');

exports.getFullDate = () => {
  const str = new Date();
  let YYYY = str.getFullYear();
  let MM = ('00' + (str.getMonth() + 1)).substr(-2);
  let DD = ('00' + str.getDate()).substr(-2);
  return YYYY + MM + DD;
};

exports.toQueryString = (obj) => Object.keys(obj)
  .filter(key => key !== 'sign' && obj[key] !== void 0 && obj[key] !== '')
  .sort()
  .map(key => key + '=' + obj[key])
  .join('&');

exports.generate = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let noceStr = '',
    maxPos = chars.length;
  while (length--) noceStr += chars[Math.random() * maxPos | 0];
  return noceStr;
};

// 简易版Object转XML，不支持嵌套
exports.buildXML = (obj, rootName = 'xml') => {
  let content = Object.keys(obj).map((item) => {
    return `<${item}>${obj[item]}</${item}>`
  })
  return `<${rootName}>${content.join('')}</${rootName}>`
};

// 简易版XML转Object，不支持嵌套
exports.parseXML = (xml) => {
  let xmlReg = /<xml.*?>([\s|\S]*)<\/xml>/
  let str = xmlReg.exec(xml)[1]
  let obj = {}
  const nodeReg = /<(.*?)>(?:\<\!\[CDATA\[){0,1}(.*?)(\]\]\>){0,1}<\/.*?>/g
  let matches = null
  while (matches = nodeReg.exec(str)) {
    obj[matches[1]] = matches[2]
  }
  return obj
};
