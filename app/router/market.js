'use strict';

//首页

module.exports = app => {
  const router = app.router.namespace('/new/market');
  const {controller} = app;


  /**
   * 门店
   */
  router.get('/shop/list', controller.market.shopList);
  router.get('/shop/name/list', controller.market.shopNameList);
  router.get('/shop/:id', controller.market.shopDetail);
  router.post('/shop', controller.market.shopAdd);
  router.put('/shop/:id', controller.market.shopEdit);
  router.put('/shop/audit/:id', controller.market.shopAudit);
  router.delete('/shop/:id', controller.market.shopDelete);
  router.get('/tijin/online/list', controller.market.onlineList);
  router.post('/tijin/offline/list', controller.market.offlineList);

};
