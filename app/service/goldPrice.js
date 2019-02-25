'use strict';

const Service = require('egg').Service;

class GoldPrice extends Service {

  async remoteGoldPriceShanghai() {
    const {url_shanghai, key} = this.ctx.app.config.goldPrice;
    const res = await this.ctx.curl(`${url_shanghai}?key=${key}`, {dataType: 'json'});
    if (res.data && res.data.error_code === 0) {
      let result = {};
      res.data.result.forEach(function (item) {
        if (item.variety === 'Au99.99') {
          result = item;
        }
      });
      return result;
    }
    throw new Error(`${Date.now()}：实时金价获取异常!`);

  }

  async goldPriceShanghai() {
    //优先从本地缓存中取
    if (this.ctx.app.gold_price_shanghai) {
      // console.log('loccccccal')
      return this.ctx.app.gold_price_shanghai;
    }

    //其次从缓存数据库redis取
    const priceRedis = await this.ctx.service.cache.get('gold_price_shanghai');
    if (priceRedis) {
      // console.log('reeeeeedis')
      return priceRedis;
    }
    //最后直接从远程数据源取
    return await this.remoteGoldPriceShanghai();
  }

  async remoteGoldPriceNewYork() {
    const {url_NewYork, key} = this.ctx.app.config.goldPrice;
    const res = await this.ctx.curl(`${url_NewYork}?key=${key}`, {dataType: 'json'});
    if (res.data && res.data.error_code === 0) {
      let result = {};
      res.data.result.forEach(function (item) {
        if (item.name === '伦敦黄金') {
          result = item;
        }
      });
      return result;
    }
    throw new Error(`${Date.now()}：实时金价获取异常!`);

  }

  async goldPriceNewYork() {
    //优先从本地缓存中取
    if (this.ctx.app.gold_price_NewYork) {
      // console.log('loccccccal')
      return this.ctx.app.gold_price_NewYork;
    }

    //其次从缓存数据库redis取
    const priceRedis = await this.ctx.service.cache.get('gold_price_NewYork');
    if (priceRedis) {
      // console.log('reeeeeedis')
      return priceRedis;
    }
    //最后直接从远程数据源取
    return await this.remoteGoldPriceNewYork();
  }


}

module.exports = GoldPrice;