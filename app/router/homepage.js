'use strict';

//首页

module.exports = app => {
  const router = app.router.namespace('/new/homepage');
  const {controller} = app;


  router.post('/user/login', controller.user.login);

  router.get('/bill/chart', controller.bill.chart);
  router.get('/bill/management', controller.bill.management);

};
