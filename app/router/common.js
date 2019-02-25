'use strict';

//首页

module.exports = app => {
  const router = app.router.namespace('/new/common');
  const {controller} = app;


  // // 上海黄金交易所实时金价
  router.get('/gold/price/shanghai', controller.common.goldPriceShanghai);
  // // 国际（纽约）实时金价
  router.get('/gold/price/NewYork', controller.common.goldPriceNewYork);
  // 大屏幕数据列表
  router.get('/gold/price/list', controller.common.goldPriceList);

};
