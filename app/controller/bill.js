'use strict';

const Controller = require('egg').Controller;

class BillController extends Controller {
  async chart() {
    const {ctx, service} = this;

    ctx.validate({
      start_date: 'date',
      end_date: 'date',
      type: ['weight', 'money', 'interest', 'fee', 'take'],
    }, ctx.query);

    ctx.body = await service.bill.chart(ctx.query);

  }

  async management() {
    const {ctx, service} = this;

    ctx.body = await service.bill.management();

  }

}

module.exports = BillController;
