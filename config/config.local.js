'use strict';

module.exports = () => {
  const config = exports = {};

  config.server = {
    host: '*******',
    port: 80
  };

  config.security = {
    csrf: {
      enable: false, // 关闭csrf防范
      // ignore: ctx => ctx.isInnerIp(ctx.ip), // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      // queryName: '_csrf', // 通过 query 传递 CSRF token 的默认字段为 _csrf
      // bodyName: '_csrf', // 通过 body 传递 CSRF token 的默认字段为 _csrf
    },
  };

  config.redis = {
    client: {
      port: 1111, // Redis port
      host: '****', // Redis host
      password: '******',
      db: 0,
    },
  };

  config.jwt = {
    salt: '*********',
    exp: 90
  };

  config.tokenRequired = {
    enable: false, // 开发环境可以关闭token验证
    ignore: '/new/homepage/user/login' // 忽略登录接口的token验证
  };

  // 操作记录中间件需保持和token验证中间件一同开启或关闭
  config.operateRecord = {
    enable: false,
    ignore: '/new/homepage/user/login' // 忽略登录接口的token验证
  };


  return config;
};

