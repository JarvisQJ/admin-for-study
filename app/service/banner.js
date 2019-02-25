'use strict';

const Service = require('egg').Service;

class Banner extends Service {
  async bannerAdd(body) {
    return await this.ctx.model.Banner.create(body);
  }

  async bannerEdit(id, body) {
    return await this.ctx.model.Banner.update(body, {where: {id}});
  }

  async bannerList(query) {
    const condition = {};
    if (query.title) condition.title = {$like: '%' + query.title + '%'};
    if (query.category !== '-1') condition.category = query.category;
    return await this.ctx.model.Banner.findAndCountAll({
      where: condition,
      order: [
        ['create_time', 'DESC']
      ],
      limit: query.pageSize,
      offset: query.pageSize * (query.pageIndex - 1)
    });
  }


}

module.exports = Banner;