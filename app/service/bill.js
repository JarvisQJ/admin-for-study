'use strict';

const Service = require('egg').Service;

class Bill extends Service {
  async chart(query) {
    return await this.ctx.model.query('CALL report_home_page_chart (:start_date, :end_date, :type)', {
      raw: true,
      replacements: {
        start_date: query.start_date,
        end_date: query.end_date,
        type: query.type
      }
    });
  }

  async management() {
    // console.log('this.ctx.model.QueryTypes', this.ctx.model.QueryTypes)
    return await this.ctx.model.query('CALL report_home_page_management');
  }

}

module.exports = Bill;