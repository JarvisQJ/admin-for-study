'use strict';

//首页

module.exports = app => {
  const router = app.router.namespace('/new/finance');
  const {controller} = app;

  /**
   *财务中心-财务
   */
  router.get('/integrative/statistics', controller.finance.integrativeStatistics);
  router.get('/user/ranking', controller.finance.userRanking);
  router.get('/sale/statistics', controller.finance.saleStatistics);
  router.get('/statistics/list', controller.finance.statisticsList);
  router.get('/withdraw/list', controller.finance.withdrawList);
  router.put('/financial/audit/:id', controller.finance.financialAudit);
  router.get('/ceo/audit/list', controller.finance.ceoAuditList);
  router.put('/ceo/audit/:id', controller.finance.ceoAudit);
  router.get('/charge/list', controller.finance.chargeList);
  router.get('/deal/flow', controller.finance.dealFlow);

};
