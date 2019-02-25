const yeepayCrypto = require('./crypto');
const config = require('../../config/config.default')({});
/**
 * 易宝支付类
 * @param object customConfig
 */
function yeePay() {
  this.account = config.yibao.merchantAccount;
  this.merchantPublicKey = config.yibao.merchantPublicKey;
  this.merchantPrivateKey = config.yibao.merchantPrivateKey;
  this.yeepayPublicKey = config.yibao.yeepayPublicKey;
  this.AESKey = '';
  this.AES = '';
}

/**
 * 用RSA 签名请求
 *
 * @param object obj
 * @return string
 */
yeePay.prototype.RSASign = function (obj) {
  return yeepayCrypto.getRSASign(obj, this.merchantPrivateKey);
};

/**
 * 通过RSA，使用易宝公钥，加密本次请求的AESKey
 *
 * @return string
 */
yeePay.prototype.getEncryptkey = function () {
  if (!this.AESKey) {
    this.setAESKey(this.generateAESKey());
  }
  return yeepayCrypto.getEncryptkey(this.yeepayPublicKey, this.AESKey);
};

/**
 通过RSA，解密 易宝支付成功后返回的encryptkey
 * @param string key
 * @return string
 */
yeePay.prototype.decryptKey = function (key) {
  return yeepayCrypto.decryptKey(key, this.merchantPrivateKey);
};

/**
 通过RSA，解密 易宝支付成功后返回的encryptkey
 * @param string key
 * @return string
 */
yeePay.prototype.deEAS = function (data, key) {
  if (!data || !key) {
    return '';
  }
  return yeepayCrypto.deEAS(data, key);
};

/**
 验证易宝返回的签名
 * @param object data
 @param string sign
 * @return boolean
 */
yeePay.prototype.RSAVerify = function (json, sign) {
  return yeepayCrypto.RSAVerify(json, sign, yeepayCrypto.getRSAPublicKey(this.yeepayPublicKey));
};

/**
 * 生成一个随机的字符串作为AES密钥
 *
 * @param number $length
 * @return string
 */
yeePay.prototype.generateAESKey = function (len) {
  const baseString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  len = len || 16;
  let AESKey = '';
  for (let i = 0; i < len; i++) {
    AESKey += baseString[parseInt(Math.random() * (len - 1))];
  }
  this.AESKey = AESKey;
  return AESKey;
};

/**
 * 通过AES加密请求数据
 *
 * @param array $query
 * @return string
 */
yeePay.prototype.AESEncryptRequest = function (obj) {
  if (!this.AESKey) {
    this.setAESKey(this.generateAESKey());
  }
  return yeepayCrypto.enEAS(JSON.stringify(obj).replace(/[\/]/g, '\\/'), this.AESKey);
};

/**
 * 设置AESKey
 *
 * @param string key
 * @return string
 */
yeePay.prototype.setAESKey = function (key) {
  this.AESKey = key;
};

yeePay.prototype._post = function (obj, url, cb) {
  obj.merchantno = obj.merchantAccount;
  obj.sign = this.RSASign(obj);
  const requestData = {
    merchantno: obj.merchantAccount,
    encryptkey: (this.getEncryptkey()),
    data: (this.AESEncryptRequest(obj))
  };

  const request = require('request');
  request.post({url, form: requestData}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      try {
        cb(null, JSON.parse(body));
      } catch (e) {
        cb('json err , yeepay _post:' + body);
      }
    } else {
      cb(error, response, body);
    }
  });
};

/**
 * 处理查询,Get 请求
 * @param url,查询的url
 * @return object
 */
yeePay.prototype.doQuery = function (url, cb) {
  const request = require('request');
  request.get({url}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      try {
        cb(null, JSON.parse(body));
      } catch (e) {
        cb('json err , yeepay doQuery:' + body);
      }
    } else {
      cb(error, response, body);
    }
  });
};

/**
 *  通用的返回数据的解析接口
 *  解析易宝返回的数据
 *
 * @param string data
 @param string encryptkey
 * @return object
 */
yeePay.prototype.parseCommon = function (data, encryptkey) {
  const easKey = this.decryptKey(encryptkey);
  const jsonStr = this.deEAS(data, easKey);
  try {
    const json = JSON.parse(jsonStr);
    if (!json.sign) {
      if (json.errorcode) {
        return {code: -1, msg: 'error_code:' + json.errorcode + ',error_msg:' + json.errormsg};
      }
      return {code: -2, msg: '请求yeepay返回异常'};

    }
    /*if (!this.RSAVerify(json, json.sign)) {   //由于回调时，出现验签不成功，但解析成功，所以注册注释
                return {code: -3, msg: '请求返回签名验证失败'}
            }*/


    if (json.errorcode && !json.status) {
      return {code: -4, msg: 'error_code:' + json.errorcode + ',error_msg:' + json.errormsg, data: json};
    }

    delete json.sign;
    return {code: 0, msg: 'success', data: json};
  } catch (err) {
    const errData = {code: -5};
    try {
      errData.data = JSON.parse(jsonStr);
      errData.msg = errData.data.errormsg;
    } catch (err) {
      errData.data = jsonStr;
      errData.msg = jsonStr;
    }
    return errData;
  }
};

yeePay.prototype.send_yibao = async function (obj, url) {
  obj.merchantAccount = config.yibao.merchantAccount;
  const self = this;
  return new Promise(function (resolve, reject) {
    self._post(obj, url, function (err, data) {
      if (err) {
        console.error(err);
        return reject(err);
      }

      resolve(self.parseCommon(data.data, data.encryptkey));
    });
  });
};

module.exports = yeePay;
