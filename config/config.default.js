'use strict';
// const path = require('path');

module.exports = appInfo => {
  const config = exports = {};
  // console.log('appInfo:', appInfo);
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1538115982042_3012';

  // 配置需要的中间件，数组顺序即为中间件的加载顺序
  config.middleware = ['errorHandler', 'operateRecord', 'tokenRequired', 'packageResponse'];

  config.sequelize = {
    username: '******',
    password: '******',
    database: '*',
    host: '***',
    dialect: '*****',
    port: 3306,
    timezone: '+08:00'
  };

  config.server = {
    host: 'test.cicgold.cn',
    port: 80
  };

  config.security = {
    csrf: {
      enable: false, // 开启/关闭csrf防范
      // ignoreJSON: true
      // ignore: ctx => ctx.isInnerIp(ctx.ip), // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      // queryName: '_csrf', // 通过 query 传递 CSRF token 的默认字段为 _csrf
      // bodyName: '_csrf', // 通过 body 传递 CSRF token 的默认字段为 _csrf
    },
    // domainWhiteList: ['http://xinban.cicgold.cn', 'http://127.0.0.1:7001', 'http://192.168.0.171:7001']
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  config.validate = {
    convert: true,
    // validateRoot: false,
  };

  // config.xframe = {
  //   enable: false,
  // };

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '*******', // Redis host
      password: '******',
      db: 0,
    },
  };

  config.tokenRequired = {
    enable: true,
    ignore: ['/new/homepage/user/login', '/new/common/gold/price/*', '/new/*.html']
  };

  // 操作记录中间件需保持和token验证中间件一同开启或关闭
  config.operateRecord = {
    enable: true,
    ignore: ['/new/homepage/user/login', '/new/common/gold/price/*', '/new/*.html']
  };

  config.oss = {
    accessKeyId: '******',
    accessKeySecret: '****',
    bucketName: 'jidao-app'
  };

  config.getui = {
    host: 'http://sdk.open.api.igexin.com/****.htm',
    appId: '******',
    appKey: '********',
    masterSecret: '***********'
  };

  config.goldPrice = {
    url_shanghai: 'http://apis.haoservice.com/lifeservice/gold/shgold',
    url_NewYork: 'http://apis.haoservice.com/lifeservice/gold/MetricGold',
    key: '***********'
  };

  //这个是测试环境配置，开发和测试环境使用
  config.yibao = {
    merchantAccount: '******', //商户编号
    merchantPublicKey: '********', //商户公钥
    merchantPrivateKey: '*************', //商户私钥
    yeepayPublicKey: '***********', //易宝公钥
    recharge_withdraw_config: {
      recharge_least: 0.01, //最少充值限额
      withdraw_least: 0.01//最少提现限额
    },
    bind_card_limit_bank: {
      bank_code_list: 'ICBC,BOC,CCB,PSBC,ECITIC,CEB,CIB,SPDB,SZPA,GDB,BCCD,JSBC,SHB'
    }
  };

  return config;
};

