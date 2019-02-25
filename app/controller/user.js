'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const {ctx, service} = this;

    ctx.validate({
      username: 'string',
      password: 'string',
      usertype: 'string',
    }, ctx.request.body);

    const user = await service.user.login(ctx.request.body);
    if (!user) ctx.throw(200, '用户名不存在！');

    if (!ctx.helper.validPassword(user, ctx.request.body.password)) ctx.throw(200, '密码错误!');

    // 记录用户登录信息
    const login = await service.user.saveLoginInfo(user, 'password');
    if (!login) ctx.throw(404, '登录信息异常');

    const obj = {
      userid: user.id,
      usertype: user.usertype,
      username: user.username,
      nickname: user.nickname,
      loginid: login.id,
      roleid: user.role_id,
      certificate_status: user.certificate_status,
      token: login.token,
      yibao_userid: user.yibao_userid
    };

    await service.cache.setex(user.username, obj);
    ctx.response.set('X-Auth-Token', login.token);

    ctx.body = obj;
  }

  async listAdmin() {
    const {ctx, service} = this;

    ctx.validate({
      pageIndex: 'int',
      pageSize: 'int',
      order: ['DESC', 'ASC'],
      username: {type: 'string', required: false},
      role_name: {type: 'string', required: false},
    }, ctx.query);

    ctx.body = await service.user.listAdmin(ctx.query);

  }

  async addAdmin() {
    const {ctx, service} = this;

    ctx.validate({
      username: 'string',
      nickname: 'string',
      password: 'string',
      role_id: {type: 'int', required: false},
    }, ctx.request.body);

    const user = await service.user.findByUsername(ctx.request.body.username);
    if (user.length !== 0) ctx.throw(200, '用户名已存在！');

    const newUser = await service.user.addAdmin(Object.assign({usertype: 1}, ctx.request.body));
    ctx.helper.setPassword(newUser, ctx.request.body.password);
    ctx.body = await newUser.save();
  }

  async setRole() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      role_id: 'int',
    }, Object.assign(ctx.params, ctx.request.body));


    ctx.body = await service.user.modifyUser(ctx.params.id, ctx.request.body);

  }

  async enableAdmin() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      enabled: ['0', '1'],
    }, Object.assign(ctx.params, ctx.request.body));

    ctx.body = await service.user.modifyUser(ctx.params.id, ctx.request.body);

  }

  async deleteAdmin() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.user.modifyUser(ctx.params.id, {deletedAt: Date.now()});

  }

}

module.exports = UserController;
