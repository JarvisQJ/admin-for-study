'use strict';

const Controller = require('egg').Controller;
const excelInfo = require('../../config/excel');
const Excel = require('exceljs');

class MarketController extends Controller {

  async shopList() {
    const {ctx, service} = this;

    ctx.validate({
      shop_type: ['-1', '1', '2'],
      start_date: {type: 'date', required: false},
      end_date: {type: 'date', required: false},
      username: {type: 'string', required: false},
      shop_name: {type: 'string', required: false},
      state: ['-1', '0', '1', '2', '3', '4'],
      is_export: 'int',
      id_string: {type: 'string', required: false},
      pageIndex: 'int',
      pageSize: 'int'
    }, ctx.query);

    const result = await service.shop.shopList(ctx.query);
    if (ctx.query.is_export) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet();
      worksheet.columns = excelInfo.shopList.columns;
      worksheet.addRows(JSON.parse(JSON.stringify(result.rows)));
      ctx.response.attachment(excelInfo.shopList.filename);
      ctx.status = 200;
      await workbook.xlsx.write(ctx.res);
      ctx.res.end();
    } else {
      ctx.body = result;
    }
  }

  async shopNameList() {
    const {ctx, service} = this;

    ctx.body = await service.shop.shopNameList();
  }

  async shopDetail() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int'
    }, ctx.params);

    ctx.body = await service.shop.shopDetail(ctx.params.id);
  }

  async shopAdd() {
    const {ctx, service} = this;

    ctx.validate({
      shop_type: 'int',
      username: 'string',
      name: 'string',
      province_name: 'string',
      area_name: 'string',
      district_name: 'string',
      address: 'string',
      contact_name: 'string',
      phone: 'string',
      extend_user: {type: 'string', required: false},
      photo_url: 'string',
      business_license: 'string',
      idcard_url: 'string',
      support_deposit: 'int',
      support_withdrawal: 'int',
      support_buyback: 'int',
      deposit_guide: {type: 'string', required: false},
      withdrawal_guide: {type: 'string', required: false},
      buyback_guide: {type: 'string', required: false},
      summary: {type: 'string', required: false},
      img_url: {type: 'string', required: false},
      gold_stock: {type: 'int', required: false},
      is_kpay: {type: 'string', required: false},
    }, ctx.request.body);

    ctx.body = await service.shop.shopAdd(ctx.request.body);
  }

  async shopEdit() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      shop_type: 'int',
      username: 'string',
      name: 'string',
      province_name: 'string',
      area_name: 'string',
      district_name: 'string',
      address: 'string',
      contact_name: 'string',
      phone: 'string',
      extend_user: {type: 'string', required: false},
      photo_url: 'string',
      business_license: 'string',
      idcard_url: 'string',
      support_deposit: 'int',
      support_withdrawal: 'int',
      support_buyback: 'int',
      deposit_guide: {type: 'string', required: false},
      withdrawal_guide: {type: 'string', required: false},
      buyback_guide: {type: 'string', required: false},
      summary: {type: 'string', required: false},
      img_url: {type: 'string', required: false},
      gold_stock: {type: 'int', required: false},
      is_kpay: {type: 'string', required: false},
    }, Object.assign(ctx.params, ctx.request.body));

    ctx.body = await service.shop.shopEdit(ctx.params.id, ctx.request.body);
  }

  async shopAudit() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      state: 'int',
    }, Object.assign(ctx.params, ctx.request.body));
    ctx.request.body.auditor_id = ctx.user.id;
    ctx.request.body.auditor = ctx.user.nickname;

    ctx.body = await service.shop.shopEdit(ctx.params.id, ctx.request.body);
  }

  async shopDelete() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.shop.shopEdit(ctx.params.id, {deletedAt: Date.now()});
  }

  async onlineList() {
    const {ctx, service} = this;

    ctx.validate({
      start_date: {type: 'date', required: false},
      end_date: {type: 'date', required: false},
      order_no: {type: 'string', required: false},
      username: {type: 'string', required: false},
      auditor_nickname: {type: 'string', required: false},
      state: ['-1', '0', '1', '2'],
      pageIndex: 'int',
      pageSize: 'int'
    }, ctx.query);

    ctx.body = await service.shop.onlineList(ctx.query);
  }

  async offlineList() {
    const {ctx, service} = this;

    ctx.validate({
      start_date: {type: 'date', required: false},
      end_date: {type: 'date', required: false},
      order_no: {type: 'string', required: false},
      username: {type: 'string', required: false},
      shop_id_array: {type: 'array', itemType: 'string', required: true},
      pageIndex: 'int',
      pageSize: 'int'
    }, ctx.request.body);

    ctx.body = await service.shop.offlineList(ctx.request.body);
  }


}

module.exports = MarketController;
