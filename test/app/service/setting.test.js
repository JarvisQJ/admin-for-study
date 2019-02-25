'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/service/setting.test.js', () => {
  let ctx;
  let settingService;
  before(async function() {
    ctx = app.mockContext();
    settingService = ctx.service.setting;
  });

  it('priceSet ok', async () => {
    const result = await settingService.priceSet({
      item_key: 'buy_back_price_minus',
      item_val: '0.32'
    });
    assert(result[0] === 1);

    const result2 = await settingService.priceSet({
      item_key: 'buy_back_price_minus',
      item_val: '0.32'
    });
    assert(result2[0] === 1);
  });
});
