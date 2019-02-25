'use strict';

const Controller = require('egg').Controller;

// const Joi = require('joi');

class MenuController extends Controller {
  async allMenu() {
    const {ctx, service} = this;

    ctx.validate({
      role_id: 'int'
    }, ctx.params);

    const {role_id} = ctx.params;

    const result = await service.menu.allMenu(role_id);
    if (result.length === 0) ctx.throw(404, '找不到资源！');
    ctx.body = ctx.helper.convertTree(result);
  }

  async createMenu() {
    const {ctx, service} = this;

    ctx.validate({
      father_id: 'int',
      name: 'string',
      url: {type: 'string', required: false},
      icon: {type: 'string', required: false},
      state: 'int',
    }, ctx.request.body);

    ctx.body = await service.menu.createMenu(ctx.request.body);
  }

  async getMenu() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int'
    }, ctx.params);

    const {id} = ctx.params;

    ctx.body = await service.menu.getMenu(id);
  }

  async listMenu() {
    const {ctx, service} = this;

    ctx.validate({
      pageIndex: 'int',
      pageSize: 'int',
      orderBy: ['id', 'username', 'createdAt'],
      order: ['DESC', 'ASC'],
    }, ctx.query);

    ctx.body = await service.menu.listMenu(ctx.query);
  }

  async modifyMenu() {
    const {ctx, service} = this;

    ctx.validate({
      name: 'string',
      url: {type: 'string', required: false},
      icon: {type: 'string', required: false},
      state: 'int',
      id: 'int',
    }, Object.assign(ctx.params, ctx.request.body));

    ctx.body = await service.menu.modifyMenu(ctx.params.id, ctx.request.body);
  }

  async setUnusable() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.menu.setUnusable(ctx.params.id);
  }

  async setUsable() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.menu.setUsable(ctx.params.id);
  }

  async deleteMenu() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.menu.deleteMenu(ctx.params.id);
  }


}

module.exports = MenuController;
