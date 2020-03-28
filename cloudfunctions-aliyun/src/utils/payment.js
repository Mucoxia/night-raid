const util = require('./util');

class Payment {
  constructor({
    appid,
    mchid,
    partnerKey,
    pfx,
    notify_url,
    refund_url,
    spbill_create_ip,
    sandbox
  } = {}, debug = false) {
    if (!appid) throw new Error('appid fail');
    if (!mchid) throw new Error('mchid fail');
    if (!partnerKey) throw new Error('partnerKey fail');

    this.appid = appid;
    this.mchid = mchid;
    this.partnerKey = partnerKey;
    this.pfx = pfx;
    this.notify_url = notify_url;
    this.refund_url = refund_url;
    this.spbill_create_ip = spbill_create_ip || '127.0.0.1';
    this.urls = sandbox ? {
      unifiedorder: 'https://api.mch.weixin.qq.com/sandboxnew/pay/unifiedorder',
      orderquery: 'https://api.mch.weixin.qq.com/sandboxnew/pay/orderquery',
      closeorder: 'https://api.mch.weixin.qq.com/sandboxnew/pay/closeorder',
      refund: 'https://api.mch.weixin.qq.com/sandboxnew/secapi/pay/refund',
      refundquery: 'https://api.mch.weixin.qq.com/sandboxnew/pay/refundquery',
    } : {
      unifiedorder: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      orderquery: 'https://api.mch.weixin.qq.com/pay/orderquery',
      closeorder: 'https://api.mch.weixin.qq.com/pay/closeorder',
      refund: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
      refundquery: 'https://api.mch.weixin.qq.com/pay/refundquery',
    };
    this.debug = debug;
  }

  log(...args) {
    if (this.debug) console.log(...args);
  }

  static init(...args) {
    return new Payment(...args);
  }

  async _parse(xml, type, signType) {
    let json = util.parseXML(xml);

    if (json.return_code !== 'SUCCESS') throw new Error(json.return_msg || 'XMLDataError');
    if (json.result_code !== 'SUCCESS') throw new Error(json.err_code || 'XMLDataError');

    if (json.appid !== this.appid) throw new Error('appid不匹配');
    if (json.mch_id !== this.mchid) throw new Error('mch_id不匹配');

    return json;
  }

  _getSign(params, type = 'MD5') {
    let str = util.toQueryString(params) + '&key=' + this.partnerKey;
    switch (type) {
      case 'MD5':
        return util.md5(str);
      case 'HMAC-SHA256':
        return util.sha256(str, this.partnerKey);
      default:
        throw new Error('signType Error');
    }
  }

  async _request(params, type, cert = false) {
    // 安全签名
    params.sign = this._getSign(params, params.sign_type);
    // 创建请求参数
    let pkg = {
      method: 'POST',
      dataType: 'text',
      data: util.buildXML(params),
      timeout: [10000, 15000]
    };

    if (cert) {
      pkg.pfx = this.pfx;
      pkg.passphrase = this.mchid;
    }

    this.log('post data =>\r\n%s\r\n', pkg.data);
    let {
      status,
      data
    } = await uniCloud.httpclient.request(this.urls[type], pkg);
    if (status !== 200) throw new Error('request fail');
    this.log('receive data =>\r\n%s\r\n', data);

    return this._parse(data, type, params.sign_type)
  }

  // 获取JS支付参数(自动下单)
  async getPayParams(params) {
    params.trade_type = params.trade_type || 'JSAPI';
    let order = await this.unifiedOrder(params);
    return this.getPayParamsByPrepay(order, params.sign_type);
  }

  // 获取JS支付参数(通过预支付会话标志)
  getPayParamsByPrepay(params, signType) {
    let pkg = {
      appId: params.sub_appid || this.appid,
      timeStamp: '' + (Date.now() / 1000 | 0),
      nonceStr: util.generate(),
      package: 'prepay_id=' + params.prepay_id,
      signType: signType || 'MD5'
    };
    pkg.paySign = this._getSign(pkg, signType);
    return pkg;
  }

  // 统一下单
  unifiedOrder(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5',
      notify_url: params.notify_url || this.notify_url,
      spbill_create_ip: params.spbill_create_ip || this.spbill_create_ip,
      trade_type: params.trade_type || 'JSAPI'
    };

    return this._request(pkg, 'unifiedorder');
  }

  // 订单查询
  orderQuery(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5'
    };

    return this._request(pkg, 'orderquery');
  }

  // 关闭订单
  closeOrder(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5'
    };

    return this._request(pkg, 'closeorder');
  }

  // 申请退款
  refund(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5',
      op_user_id: params.op_user_id || this.mchid,
      notify_url: params.notify_url || this.refund_url
    };
    if (!pkg.notify_url) delete pkg.notify_url;

    return this._request(pkg, 'refund', true);
  }

  // 查询退款
  refundQuery(params) {
    let pkg = {
      ...params,
      appid: this.appid,
      mch_id: this.mchid,
      nonce_str: util.generate(),
      sign_type: params.sign_type || 'MD5'
    };

    return this._request(pkg, 'refundquery');
  }
}

module.exports = Payment;
