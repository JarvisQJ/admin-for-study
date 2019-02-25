'use strict';

const Controller = require('egg').Controller;

class RoleController extends Controller {
  async listRole() {
    const {ctx, service} = this;

    ctx.validate({
      pageIndex: 'int',
      pageSize: 'int',
      orderBy: ['count', 'state', 'createdAt'],
      order: ['DESC', 'ASC'],
    }, ctx.query);

    ctx.body = await service.role.listRole(ctx.query);

  }

  async createRole() {
    const {ctx, service} = this;
    ctx.validate({
      name: 'string',
      remark: 'string',
      state: 'int',
    }, ctx.request.body);

    ctx.body = await service.role.createRole(ctx.request.body);
  }

  async getRole() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int'
    }, ctx.params);

    const {id} = ctx.params;

    ctx.body = await service.role.getRole(id);
  }

  async modifyRole() {
    const {ctx, service} = this;

    ctx.validate({
      name: 'string',
      remark: 'string',
      state: 'int',
      id: 'int',
    }, Object.assign(ctx.params, ctx.request.body));

    ctx.body = await service.role.modifyRole(ctx.params.id, ctx.request.body);
  }

  async deleteRole() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, Object.assign(ctx.params));

    ctx.body = await service.role.modifyRole(ctx.params.id, {deletedAt: Date.now()});
  }

  async nameList() {
    const {ctx, service} = this;

    ctx.body = await service.role.nameList();
  }

  async setRoleMenu() {
    const {ctx, service} = this;
    ctx.validate({
      type: ['0', '1'],
      role_id: 'int',
      menu_id: 'int',
    }, ctx.request.body);

    ctx.body = await service.role.setRoleMenu(ctx.request.body);
  }

  async roleMenuList() {
    const {ctx, service} = this;
    ctx.validate({
      role_id: 'int',
    }, ctx.params);

    const result = await service.role.roleMenuList(ctx.params.role_id);
    if (result.length === 0) ctx.throw(404, '找不到资源！');
    ctx.body = ctx.helper.convertTree(result);
  }


}

module.exports = RoleController;
