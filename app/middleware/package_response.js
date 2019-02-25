'use strict';

module.exports = () => {
  // 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
  return async function (ctx, next) {
    await next();
    // 包装返回数据。
    ctx.body = Object.assign({code: 1, message: '执行成功'}, {data: ctx.body || null});
    // ctx.body为null时，koa会将status值变为201；ctx.status值不为200时，不会返回消息体
    ctx.status = 200;
  };
};
