'use strict';

const Service = require('egg').Service;
const gt = require('../../config/config.default')({}).getui;
// console.log('gt:', gt)
const getui = require('getui-node').init(gt.host, gt.appId, gt.appKey, gt.masterSecret);

class Getui extends Service {
  async pushToSingle(user_id, content, title) {
    //获取用户信息
    const user = await this.ctx.model.UicUser.findById(user_id);
    if (!user) return;
    // 获取clientID和clientID
    let clientID = null;
    let deviceToken = null;
    const result = await this.ctx.service.cache.get(user.username);
    if (result && result.hasOwnProperty('device_token')) {
      deviceToken = result.device_token;
    }
    if (result && result.hasOwnProperty('clientid')) {
      clientID = result.clientid;
    }
    // if (!clientID) {
    //   const login = await this.ctx.model.UicLogin.findAll({
    //     where: {user: user_id},
    //     raw: true,
    //     order: [
    //       ['createdAt', 'DESC']
    //     ],
    //     limit: 1
    //   });
    //   if (login.length !== 0) {
    //     clientID = login[0].clientid;
    //   }
    // }
    if (!deviceToken) {
      const login = await this.ctx.model.UicLogin.findAll({
        where: {user: user_id},
        raw: true,
        order: [
          ['createdAt', 'DESC']
        ],
        limit: 1
      });
      if (login.length !== 0) {
        deviceToken = login[0].devicetoken;
      }
    }

    // console.log('clientID:', clientID)
    // console.log('deviceToken:', deviceToken)

    //发推送
    if (clientID) {
      // console.log('1111111111111111111111111111')
      // 退出中金APP接不到到推送
      await getui.pushMessageToSingle(clientID, content, 2, title, 0, null);
    } else if (deviceToken) {
      // console.log('2222222222222222222222222222222222222222222222')
      // 退出中金APP仍然可以接到推送
      await getui.pushAPNMessageToSingle(deviceToken, title, content, 0, null);
    }

  }


}

module.exports = Getui;