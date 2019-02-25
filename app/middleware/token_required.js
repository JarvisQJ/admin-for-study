'use strict';

const jwt = require('jsonwebtoken');

module.exports = () => {
  // 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
  return async function (ctx, next) {

    let token = '';
    if (ctx.headers.authorization && ctx.headers.authorization.split(' ')[0] === 'Bearer') {
      token = ctx.headers.authorization.split(' ')[1];
    } else if (ctx.query.token) {
      token = ctx.query.token;
    } else {
      ctx.throw(401, '授权失败,请检查token值');
    }


    const decoded = jwt.verify(token, ctx.app.config.jwt.salt);
    if (!decoded || !decoded.username) {
      ctx.throw(401, 'token无效，请重新登录');
    }

    const redis_user_auth_info = await ctx.service.cache.get(decoded.username)
    if (!redis_user_auth_info || !redis_user_auth_info.token) {
      ctx.throw(401, 'token已失效，请重新登录');
    }

    if (token !== redis_user_auth_info.token) {
      ctx.throw(401, '该用户已经在其它设备上登录，要进行操作，请退出重新登录');
    }

    ctx.user = decoded;
    ctx.user.token = token;
    await next();
  };
};
