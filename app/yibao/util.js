const _ = require('underscore');

/**
 *是否为空对象
 *@param object val
 *@return boolean
 */
function isNotEmptyObj(val) {
  return _.isObject(val) && !_.isEmpty(val);
}
/**
 * 对象按键排序
 * @param object obj
 * @param boolean desc
 * @return object
 */
function sortObjectByKey(obj, desc) {
  let keys = Object.keys(obj);
  const returnObj = {};
  keys = keys.sort();
  if (desc) {
    keys = keys.reverse();
  }
  for (let i = 0, len = keys.length; i < len; i++) {
    returnObj[keys[i]] = obj[keys[i]];
  }
  return returnObj;
}
/**
 * 将字符串转化为查询字符串
 * @param object json
 * @return str
 */
function jsonToSearch(json) {
  let str = '';
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      str += key + '=' + json[key] + '&';
    }
  }
  //把最后的&去掉
  if (str) {
    str = str.substring(0, str.length - 1);
  }
  return str;
}
/**
 *生成一个随机的字符串
 *@param number len
 */
function generateKey(len) {
  const baseString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  len = len || 16;
  let str = '';
  for (let i = 0; i < len; i++) {
    str += baseString[parseInt(Math.random() * (len - 1))];
  }
  return str;
}

/**
 * 获取默认配置keys
 *
 * @return array
 */
function getDefaultKey() {
  return ['merchantaccount', 'currency', 'productcatalog', 'productname', 'productdesc', 'identitytype', 'terminaltype', 'terminalid', 'callbackurl', 'fcallbackurl'];
}
/**
 * 获取默认配置
 *
 * @return object
 */
function getDefaultConfig(json) {
  const keys = getDefaultKey();
  const result = {};
  for (let i = 0, len = keys.length; i < len; i++) {
    result[keys[i]] = json[keys[i]];
  }
  return result;
}

module.exports = {
  isNotEmptyObj,
  sortObjectByKey,
  jsonToSearch,
  generateKey,
  getDefaultKey,
  getDefaultConfig
};
