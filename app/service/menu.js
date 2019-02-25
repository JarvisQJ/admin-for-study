'use strict';

const Service = require('egg').Service;

class Menu extends Service {
  async allMenu(role_id) {
    const menuIds = await this.ctx.model.ManageRolemenu.findAll({
      raw: true,
      attributes: ['menu_id'],
      where: {
        role_id
      }
    }).map(function (item) {
      return item.menu_id;
    });

    const condition = {
      state: 1,
      deletedAt: null
    };
    if (role_id !== 0) condition.id = menuIds;

    return await this.ctx.model.ManageMenu.findAll({
      raw: true,
      where: condition
    });

  }

  async createMenu(model) {
    return await this.ctx.model.ManageMenu.create(model);
  }

  async getMenu(id) {
    return await this.ctx.model.ManageMenu.findById(id);
  }

  async listMenu(query) {
    return await this.ctx.model.ManageMenu.findAndCountAll({
      order: [
        [`${query.orderBy}`, `${query.order}`]
      ],
      limit: query.pageSize,
      offset: query.pageSize * (query.pageIndex - 1)
    });
  }

  async modifyMenu(id, model) {
    return await this.ctx.model.ManageMenu.update(model, {where: {id}});
  }

  async setUnusable(id) {
    const ids = await this.ctx.model.query('SELECT get_child_menu (:id) ids', {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id
      }
    });
    const id_array = ids[0].ids.split(',');
    return await this.ctx.model.ManageMenu.update({state: 0}, {where: {id: {$in: id_array}}});
  }

  async setUsable(id) {
    const ids = await this.ctx.model.query('SELECT get_father_menu (:id) ids', {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id
      }
    });
    const id_array = ids[0].ids.split(',');
    return await this.ctx.model.ManageMenu.update({state: 1}, {where: {id: {$in: id_array}}});
  }

  async deleteMenu(id) {
    const ids = await this.ctx.model.query('SELECT get_child_menu (:id) ids', {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id
      }
    });
    const id_array = ids[0].ids.split(',');
    return await this.ctx.model.ManageMenu.update({deletedAt: Date.now()}, {where: {id: {$in: id_array}}});
  }

}

module.exports = Menu;