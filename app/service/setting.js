'use strict';

const Service = require('egg').Service;

class Setting extends Service {
  async priceSet(body) {
    // 将调整存入数据库
    const result = await this.ctx.model.SysSetting.update({item_val: body.item_val}, {
      where: {item_key: body.item_key}
    });
    if (result[0] > 0) {
      // // 存入本地缓存
      // this.ctx.app[body.item_key] = body.item_val;
      // 存入redis
      this.ctx.service.cache.setex(body.item_key, body.item_val, 60 * 60 * 24 * 365);
    }
    return result;
  }

  async priceSetList() {
    return await this.ctx.model.SysSetting.findAll({where: {item_key: {$in: ['buy_back_price_minus', 'sale_price_add']}}});
  }

  async getPriceSetData(key) {
    // console.log('appppppp:', JSON.stringify(this.ctx.app))
    // //优先从本地缓存中取
    // if (this.ctx.app[key]) {
    //   // console.log('loccccccal')
    //   // console.log(`${key}:`, this.ctx.app[key])
    //   return parseFloat(this.ctx.app[key]);
    // }

    //其次从缓存数据库redis取
    const priceRedis = await this.ctx.service.cache.get(key);
    if (priceRedis) {
      // console.log('reeeeeedis')
      // // 存入本地缓存
      // this.ctx.app[key] = priceRedis;
      return parseFloat(priceRedis);
    }
    //最后直接从数据库取
    const result = await this.ctx.model.SysSetting.findOne({where: {item_key: key}});
    if (!result) this.ctx.throw(404, `获取不到该数据：${key}`);
    //将数据存入缓存，以便下次访问更快速
    if (result) {
      // // 存入本地缓存
      // this.ctx.app[key] = result.item_val;
      // 存入redis
      this.ctx.service.cache.setex(key, result.item_val, 60 * 60 * 24 * 365);
    }
    return parseFloat(result.item_val);

  }


}

module.exports = Setting;