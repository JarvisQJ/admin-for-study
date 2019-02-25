const Subscription = require('egg').Subscription;

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '1s', // 执行间隔
      type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
      disable: false, // 配置该参数为 true 时，这个定时任务不会被启动
      // env: ['dev'], // 数组，仅在指定的环境下才启动该定时任务/**/
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    // console.log('schedule running:', new Date());
    // 获取并保存上海金价
    const res = await this.ctx.service.goldPrice.remoteGoldPriceShanghai();
    if (res) {
      // // 存入本地缓存（该方案存在缺陷：res数据只能存储在当前worker。）
      // this.ctx.app.gold_price_shanghai = res;
      // 存入redis
      this.ctx.service.cache.setex('gold_price_shanghai', res, 10);
    }

    // 获取并保存纽约金价
    const res2 = await this.ctx.service.goldPrice.remoteGoldPriceNewYork();
    if (res2) {
      // // 存入本地缓存（该方案存在缺陷：res数据只能存储在当前worker。）
      // this.ctx.app.gold_price_NewYork = res2;
      // 存入redis
      this.ctx.service.cache.setex('gold_price_NewYork', res2, 10);
    }
  }
}

module.exports = UpdateCache;