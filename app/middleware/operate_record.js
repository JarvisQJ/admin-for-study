'use strict';

module.exports = () => {
  // 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
  return async function (ctx, next) {
    await next();
    if (ctx.request.method !== 'GET') {
      await ctx.service.operate.createOperateRecord({
        operate_type: ctx.request.method,
        operate_route: ctx.request.url,
        operate_para: JSON.stringify(Object.assign(ctx.params, ctx.query, ctx.request.body)),
        IP_address: ctx.ip,
        creator: ctx.user.username
      });
    }
  };
};
