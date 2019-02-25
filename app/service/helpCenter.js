'use strict';

const Service = require('egg').Service;

class HelpCenter extends Service {

  async questionAdd(body) {
    return await this.ctx.model.HelpCenter.create(body);
  }

  async questionEdit(id, body) {
    return await this.ctx.model.HelpCenter.update(body, {where: {id}});
  }


  async questionList(query) {
    const condition = {};
    if (query.question) condition.question = {$like: '%' + query.question + '%'};
    if (query.type !== -1) condition.type = query.type;
    return await this.ctx.model.HelpCenter.findAndCountAll({
      where: condition,
      order: [
        ['create_time', 'DESC']
      ],
      limit: query.pageSize,
      offset: query.pageSize * (query.pageIndex - 1)
    });
  }


}

module.exports = HelpCenter;