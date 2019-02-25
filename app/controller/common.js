'use strict';

const Controller = require('egg').Controller;

class CommonController extends Controller {
  async goldPriceShanghai() {
    const {ctx, service} = this;

    ctx.body = await service.goldPrice.goldPriceShanghai();

  }

  async goldPriceNewYork() {
    const {ctx, service} = this;

    ctx.body = await service.goldPrice.goldPriceNewYork();

  }

  async goldPriceList() {
    const {ctx, service} = this;

    const priceShanghai = await service.goldPrice.goldPriceShanghai();
    const priceNewYork = await service.goldPrice.goldPriceNewYork();
    const buy_back_price_minus = await service.setting.getPriceSetData('buy_back_price_minus');
    const sale_price_add = await service.setting.getPriceSetData('sale_price_add');

    ctx.body = [
      {
        product_name: 'au',
        buy_back_price: (priceNewYork.latestpri - buy_back_price_minus).toFixed(2),
        sale_price: (parseFloat(priceNewYork.latestpri) + sale_price_add).toFixed(2),
        maxpri: (parseFloat(priceNewYork.maxpri) + sale_price_add).toFixed(2),
        minpri: (parseFloat(priceNewYork.minpri) - buy_back_price_minus).toFixed(2),
        state: parseFloat(priceNewYork.latestpri) - parseFloat(priceNewYork.openpri)
      },
      {
        product_name: 'au9999',
        buy_back_price: parseFloat(priceShanghai.latestpri).toFixed(2),
        sale_price: parseFloat(priceShanghai.latestpri).toFixed(2),
        maxpri: parseFloat(priceShanghai.maxpri).toFixed(2),
        minpri: parseFloat(priceShanghai.minpri).toFixed(2),
        state: parseFloat(priceShanghai.latestpri) - parseFloat(priceShanghai.openpri)
      },
    ];

  }

}

module.exports = CommonController;
