'use strict';

const Service = require('egg').Service;

class Dynamic extends Service {
  async dynamicAdd(body) {
    return await this.ctx.model.TDynamic.create(body);
  }

  async dynamicEdit(id, body) {
    return await this.ctx.model.TDynamic.update(body, {where: {id}});
  }

  async dynamicList(query) {
    const condition = {};
    if (query.title) condition.title = {$like: '%' + query.title + '%'};
    if (query.category !== '-1') condition.category = query.category;
    return await this.ctx.model.TDynamic.findAndCountAll({
      where: condition,
      attributes: {exclude: ['detail']},
      order: [
        [`${query.orderBy}`, `${query.order}`]
      ],
      limit: query.pageSize,
      offset: query.pageSize * (query.pageIndex - 1)
    });
  }

  async dynamicDetail(id) {
    return await this.ctx.model.TDynamic.findById(id);
  }


}

module.exports = Dynamic;