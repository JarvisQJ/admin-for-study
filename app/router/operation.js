'use strict';

//首页

module.exports = app => {
  const router = app.router.namespace('/new/operation');
  const {controller} = app;


  router.get('/user/list', controller.operate.userList);
  router.put('/user/freeze/:id', controller.operate.userFreeze);
  router.get('/user/login/record/:id', controller.operate.userLoginRecord);
  router.get('/user/detail/:id', controller.operate.userDetail);
  router.get('/user/roll/list/:id', controller.operate.rollList);
  router.get('/user/balance/flow', controller.operate.balanceFlow);
  router.get('/user/gold/flow', controller.operate.goldFlow);
  router.get('/purchase/select', controller.operate.purchaseSelect);
  router.post('/send/sms', controller.operate.sendSms);
  router.post('/send/message', controller.operate.sendMessage);
  router.get('/usable/template/list', controller.operate.templateList);
  router.get('/product/name/list', controller.operate.productNameList);
  // 以下接口均为平台赠送红包和加息券
  router.post('/give/roll', controller.operate.giveRoll);
  router.post('/roll/request', controller.operate.rollRequest);
  router.post('/roll/coupon', controller.operate.rollCoupon);
  router.get('/roll/request/list', controller.operate.rollRequestList);
  router.get('/coupon/list', controller.operate.couponList);
  router.get('/coupon/:id', controller.operate.couponDetail);
  // router.get('/coupon/use/list', controller.operate.couponUseList);
  router.put('/coupon/:id', controller.operate.couponEdit);
  router.delete('/coupon/:id', controller.operate.couponDelete);
  router.get('/roll/request/:id', controller.operate.rollRequestDetail);
  router.put('/roll/request/:id', controller.operate.rollRequestEdit);
  router.delete('/roll/request/:id', controller.operate.rollRequestDelete);
  // 平台赠送加息券和红包详情中的列表共用。
  router.get('/roll/request/use/list', controller.operate.rollRequestUseList);

  /**
   * 系统消息
   */
  router.post('/notice', controller.operate.noticeAdd);
  router.get('/notice/list', controller.operate.noticeList);
  router.put('/notice/batch/delete', controller.operate.batchDelete);

  /**
   * 站内信
   */
  router.get('/message/list', controller.operate.messageList);
  router.delete('/message/:id', controller.operate.messageDelete);
  /**
   * banner
   */
  router.get('/sts/token', controller.operate.stsToken);
  router.post('/banner', controller.operate.bannerAdd);
  router.put('/banner/:id', controller.operate.bannerEdit);
  router.delete('/banner/:id', controller.operate.bannerDelete);
  router.put('/banner/enable/:id', controller.operate.bannerEnable);
  router.get('/banner/list', controller.operate.bannerList);
  /**
   * 动态
   */
  router.post('/dynamic', controller.operate.dynamicAdd);
  router.put('/dynamic/:id', controller.operate.dynamicEdit);
  router.delete('/dynamic/:id', controller.operate.dynamicDelete);
  router.put('/dynamic/enable/:id', controller.operate.dynamicEnable);
  router.get('/dynamic/list', controller.operate.dynamicList);
  router.get('/dynamic/:id', controller.operate.dynamicDetail);
  /**
   * 用户反馈
   */
  router.get('/feedback/list', controller.operate.feedbackList);
  router.put('/feedback/dispose/:id', controller.operate.feedbackDispose);
  router.delete('/feedback/:id', controller.operate.feedbackDelete);
  /**
   * 帮助中心
   */
  router.post('/question', controller.operate.questionAdd);
  router.put('/question/:id', controller.operate.questionEdit);
  router.delete('/question/:id', controller.operate.questionDelete);
  router.put('/question/enable/:id', controller.operate.questionEnable);
  router.get('/question/list', controller.operate.questionList);
  /**
   * 礼包查询
   */
  router.get('/roll/statistic/list', controller.operate.statisticList);
  /**
   * 邀请好友查询
   */
  router.get('/invite/list', controller.operate.inviteList);

};
