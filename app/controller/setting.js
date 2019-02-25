'use strict';

const Controller = require('egg').Controller;

class SettingController extends Controller {
  async priceSet() {
    const {ctx, service} = this;

    ctx.validate({
      item_key: ['buy_back_price_minus', 'sale_price_add'],
      item_val: 'string'
    }, ctx.request.body);

    ctx.body = await service.setting.priceSet(ctx.request.body);

  }

  async priceSetList() {
    const {ctx, service} = this;


    ctx.body = await service.setting.priceSetList();

  }

}

module.exports = SettingController;
