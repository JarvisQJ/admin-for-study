'use strict';

const Service = require('egg').Service;

const SMSClient = require('@alicloud/sms-sdk');
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'LTAIkDdVEDxSJGvE';
const secretAccessKey = 'mR3xtmmiUAm4qazU1XY5tJGJ48BgLS';
// //在云通信页面开通相应业务消息后，就能在页面上获得对应的queueName,不用填最后面一段
// const queueName = 'Alicom-Queue-1092397003988387-'
//初始化sms_client
const smsClient = new SMSClient({accessKeyId, secretAccessKey});

class SmsService extends Service {
  // 批量发送，不同手机号可以使用不同模板和不同变量
  async sendBatchSMS(param) {
    return new Promise(function (resolve, reject) {
      smsClient.sendBatchSMS(param).then(function (res) {
        const {Code} = res;
        if (Code === 'OK') {
          //处理返回参数
          resolve(res);
        }
      }, function (err) {
        reject(err);
      });
    });
  }

  // 单个发送；也支持批量发送，不同手机号可以使用相同模板和相同变量
  async sendSMS(param) {
    return new Promise(function (resolve, reject) {
      smsClient.sendSMS(param).then(function (res) {
        const {Code} = res;
        if (Code === 'OK') {
          //处理返回参数
          resolve(res);
        }
      }, function (err) {
        reject(err);
      });
    });
  }

}

module.exports = SmsService;
