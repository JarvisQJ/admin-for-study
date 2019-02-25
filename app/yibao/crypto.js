const crypto = require('crypto');
const ursa = require('ursa');
const _ = require('underscore');
const util = require('./util');

/**
 获取rsa私钥的前缀
 @return string
 */
function getRSAPrivateKeyPrefix() {
  return '-----BEGIN PRIVATE KEY-----\r\n';
}

/**
 获取rsa私钥的后缀
 @return string
 */
function getRSAPrivateKeySuffix() {
  return '-----END PRIVATE KEY-----';
}

/**
 获取rsa公钥的前缀
 @return string
 */
function getRSAPublickKeyPrefix() {
  return '-----BEGIN PUBLIC KEY-----\r\n';
}

/**
 获取rsa公钥的后缀
 @return string
 */
function getRSAPublicKeySuffix() {
  return '-----END PUBLIC KEY-----';
}

/**
 @param string key
 格式化rsa的私钥，64位长度为一行
 @return string
 */
function formatRSAKey(key) {
  const len = key.length;
  const privateLen = 64;//private key 64 length one line
  const space = Math.floor(len / privateLen);
  const flag = len % privateLen === 0;
  let str = '';
  for (let i = 0; i < space; i++) {
    str += key.substr(i * privateLen, privateLen) + '\r\n';
  }
  if (!flag) {
    str += key.substring(space * privateLen) + '\r\n';
  }
  return str;
}

/**
 @param string key rsa的私钥
 返回标准格式的rsa的私钥
 @return string
 */
function getRSAPrivateKey(key) {
  return getRSAPrivateKeyPrefix() + formatRSAKey(key) + getRSAPrivateKeySuffix();
}

/**
 @param string key rsa的私钥
 返回标准格式的rsa的公钥
 @return string
 */
function getRSAPublicKey(key) {
  return getRSAPublickKeyPrefix() + formatRSAKey(key) + getRSAPublicKeySuffix();
}

/**
 * 加密
 *
 * @param string data
 * @param string key
 * @param string algorithm
 * @param string clearEncoding
 * @param string cipherEncoding
 * @param string iv
 * @return string
 */
function encrypt(data, key, algorithm, clearEncoding, cipherEncoding, iv) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  cipher.setAutoPadding(true);
  const cipherChunks = [];
  cipherChunks.push(cipher.update(new Buffer(data), clearEncoding, cipherEncoding));
  cipherChunks.push(cipher.final(cipherEncoding));
  return cipherChunks.join('');
}

/**
 * 解密
 *
 * @param string data
 * @param string key
 * @param string algorithm
 * @param string clearEncoding
 * @param string cipherEncoding
 * @param string iv
 * @return string
 */
function decrypt(cipherChunks, key, algorithm, clearEncoding, cipherEncoding, iv) {
  /*var decipher = crypto.createDecipheriv(algorithm, key, iv);
    var plainChunks = [];
    for (var i = 0, len = cipherChunks.length; i < len; i++) {
        plainChunks.push(decipher.update(cipherChunks[i], cipherEncoding, clearEncoding));
    }
    plainChunks.push(decipher.final(clearEncoding));
    return plainChunks.join('');*/

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decoded = decipher.update(cipherChunks, cipherEncoding, clearEncoding);
  decoded += decipher.final(clearEncoding);
  return decoded;
}

/**
 * 加密 EAS
 *
 * @param string data
 * @param string key
 * @return string
 */
function enEAS(data, key) {
  let str = '';
  try {
    str = encrypt(data, key, 'aes-128-ecb', 'utf8', 'base64', '');
  } catch (e) {
    console.error('yeepay SDK enEAS error : ' + e);
  }
  return str;
}

/**
 * 解密 EAS
 *
 * @param string data
 * @param string key
 * @return string
 */
function deEAS(data, key) {
  let str = '';
  try {
    //data = decodeURIComponent(data);
    data = new Buffer(data, 'base64').toString('binary');
    str = decrypt(data, key, 'aes-128-ecb', 'utf8', 'binary', '');
  } catch (e) {
    console.error('yeepay SDK deEAS error : ' + e);
  }
  return str;
}

/**
 * 获取rsa签名
 *
 * @param object obj
 * @param string merchantPrivateKey
 * @param string algorithm
 * @return string
 */
function getRSASign(obj, merchantPrivateKey, algorithm) {
  if (obj.sign) {
    delete obj.sign;
  }
  obj = util.sortObjectByKey(obj);
  const values = _.values(obj);
  const valStr = values.join('');
  //valStr = utf8.encode(valStr);//中文字符使用UTF-8编码,see:http://mobiletest.yeepay.com/file/doc/pubshow?doc_id=19#hm_6, keyword:RSA验签
  algorithm = algorithm || 'RSA-SHA1';
  const RSA = crypto.createSign(algorithm);
  const pem = getRSAPrivateKey(merchantPrivateKey);
  RSA.update(valStr);
  return RSA.sign(pem, 'base64');
}

/**
 * 签名认证
 *
 * @param object json
 * @param string sign
 * @param string yibaoPublickKey
 * @param string algorithm
 * @return boolean
 */
function RSAVerify(json, sign, yibaoPublickKey, algorithm) {
  let flag = false;
  if (!_.isObject(json)) {
    return flag;
  }
  delete json.sign;
  try {
    json = util.sortObjectByKey(json);
    const values = _.values(json);
    const valStr = values.join('');
    //valStr = utf8.encode(valStr);//中文字符使用UTF-8编码,see:http://mobiletest.yeepay.com/file/doc/pubshow?doc_id=19#hm_6, keyword:RSA验签
    algorithm = algorithm || 'RSA-SHA1';
    const verifier = crypto.createVerify(algorithm);
    verifier.update(valStr);
    flag = verifier.verify(yibaoPublickKey, sign, 'base64');
  } catch (e) {
    console.error('yeepay SDK RSAVerify error : ' + e);
  }
  return flag;
}

function getEncryptkey(publicKey, aesKey) {
  const crt = ursa.createPublicKey(getRSAPublicKey(publicKey));
  return crt.encrypt(aesKey, 'utf8', 'base64', ursa.RSA_PKCS1_PADDING);
}

function decryptKey(encryptkey, merchantPrivateKey) {
  let str = '';
  try {
    //var key = decodeURIComponent(encryptkey);
    const key = encryptkey;

    //key = new Buffer(key, 'base64').toString();//易宝要求必须进行base64解码才能得到正确的解密 eas key
    const pem = ursa.createPrivateKey(getRSAPrivateKey(merchantPrivateKey));
    str = pem.decrypt(key, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING);
  } catch (e) {
    console.error('yeepay SDK decryptKey error : ' + e);
  }
  return str;
}

module.exports = {
  encrypt,
  decrypt,
  enEAS,
  deEAS,
  getRSASign,
  getRSAPrivateKey,
  getRSAPublicKey,
  RSAVerify,
  getEncryptkey,
  decryptKey
};
