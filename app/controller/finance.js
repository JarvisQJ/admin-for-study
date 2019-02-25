'use strict';

const Controller = require('egg').Controller;
const excelInfo = require('../../config/excel');
const Excel = require('exceljs');

class FinanceController extends Controller {

  async integrativeStatistics() {
    const {ctx, service} = this;

    ctx.validate({
      start_date: 'date',
      end_date: 'date',
    }, ctx.query);

    ctx.body = await service.finance.integrativeStatistics(ctx.query);

  }

  async userRanking() {
    const {ctx, service} = this;

    ctx.validate({
      is_export: 'int',
      id_string: {type: 'string', required: false},
      start_date: {type: 'date', required: false},
      end_date: {type: 'date', required: false},
      orderBy: ['username', 'order_moneys', 'order_counts', 'order_weights'],
      order: ['DESC', 'ASC'],
      pageIndex: 'int',
      pageSize: 'int'
    }, ctx.query);

    // console.log('query:', ctx.query);

    const result = await service.finance.userRanking(ctx.query);
    if (ctx.query.is_export === 1) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet();
      worksheet.columns = excelInfo.userRanking.columns;
      worksheet.addRows(result.rows);
      ctx.response.attachment(excelInfo.userRanking.filename);
      ctx.status = 200;
      await workbook.xlsx.write(ctx.res);
      ctx.res.end();
    } else {
      ctx.body = result;
    }

  }

  async saleStatistics() {
    const {ctx, service} = this;

    ctx.validate({
      is_export: 'int',
      id_string: {type: 'string', required: false},
      start_time: {type: 'datetime', required: false},
      end_time: {type: 'datetime', required: false},
      order_code: {type: 'string', required: false},
      order_status: {type: 'number', required: false},
      pageIndex: 'int',
      pageSize: 'int'
    }, ctx.query);

    // console.log('query:', ctx.query);

    const result = await service.finance.saleStatistics(ctx.query);
    if (ctx.query.is_export === 1) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet();
      worksheet.columns = excelInfo.saleStatistics.columns;
      worksheet.addRows(result.rows);
      ctx.response.attachment(excelInfo.saleStatistics.filename);
      ctx.status = 200;
      await workbook.xlsx.write(ctx.res);
      ctx.res.end();
    } else {
      ctx.body = result;
    }

  }

  async statisticsList() {
    const {ctx, service} = this;

    ctx.validate({
      is_export: 'int',
      id_string: {type: 'string', required: false},
      start_date: 'date',
      end_date: 'date',
      user_info: {type: 'string', required: false},
      is_vip: ['', 'Y', 'N'],
      pageIndex: 'int',
      pageSize: 'int'
    }, ctx.query);

    // console.log('query:', ctx.query);

    const result = await service.finance.statisticsList(ctx.query);
    if (ctx.query.is_export === 1) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet();
      worksheet.columns = excelInfo.statisticsList.columns;
      worksheet.addRows(result.rows);
      ctx.response.attachment(excelInfo.statisticsList.filename);
      ctx.status = 200;
      await workbook.xlsx.write(ctx.res);
      ctx.res.end();
    } else {
      ctx.body = result;
    }

  }

  async financialAudit() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      state: ['1', '2'],
      remark: {type: 'string', required: false},
      audit_type: 'string',
    }, Object.assign(ctx.params, ctx.request.body));

    if (ctx.request.body.state === '2' && !ctx.request.body.remark) ctx.throw(403, '备注信息不能为空！');
    ctx.request.body.auditor_user_id = ctx.user.id;
    ctx.request.body.auditor_nickname = ctx.user.nickname;

    ctx.body = await service.finance.financialAudit(ctx.params.id, ctx.request.body);

  }

  async ceoAudit() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      ceo_state: ['1', '2'],
      remark: {type: 'string', required: false},
      audit_type: 'string',
    }, Object.assign(ctx.params, ctx.request.body));

    if (ctx.request.body.state === '2' && !ctx.request.body.remark) ctx.throw(403, '备注信息不能为空！');
    ctx.request.body.auditor_user_id = ctx.user.id;
    ctx.request.body.auditor_nickname = ctx.user.nickname;

    ctx.body = await service.finance.ceoAudit(ctx.params.id, ctx.request.body);

  }

  async withdrawList() {
    const {ctx, service} = this;

    ctx.validate({
      is_export: 'int',
      id_string: {type: 'string', required: false},
      start_date: 'date',
      end_date: 'date',
      user_info: {type: 'string', required: false},
      state: ['', '0', '1', '2'],
      ceo_state: ['', '0', '1', '2'],
      pageIndex: 'int',
      pageSize: 'int'
    }, ctx.query);

    // console.log('query:', ctx.query);

    const result = await service.finance.withdrawList(ctx.query);
    if (ctx.query.is_export === 1) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet();
      worksheet.columns = excelInfo.withdrawList.columns;
      worksheet.addRows(result.rows);
      ctx.response.attachment(excelInfo.withdrawList.filename);
      ctx.status = 200;
      await workbook.xlsx.write(ctx.res);
      ctx.res.end();
    } else {
      ctx.body = result;
    }

  }

  async ceoAuditList() {
    const {ctx, service} = this;

    ctx.validate({
      is_export: 'int',
      id_string: {type: 'string', required: false},
      start_date: 'date',
      end_date: 'date',
      user_info: {type: 'string', required: false},
      state: ['', '0', '1', '2'],
      ceo_state: ['', '0', '1', '2'],
      pageIndex: 'int',
      pageSize: 'int'
    }, ctx.query);

    // console.log('query:', ctx.query);

    const result = await service.finance.ceoAuditList(ctx.query);
    if (ctx.query.is_export === 1) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet();
      worksheet.columns = excelInfo.ceoAuditList.columns;
      worksheet.addRows(result.rows);
      ctx.response.attachment(excelInfo.ceoAuditList.filename);
      ctx.status = 200;
      await workbook.xlsx.write(ctx.res);
      ctx.res.end();
    } else {
      ctx.body = result;
    }

  }

  async chargeList() {
    const {ctx, service} = this;

    ctx.validate({
      is_export: 'int',
      id_string: {type: 'string', required: false},
      start_time: {type: 'datetime', required: false},
      end_time: {type: 'datetime', required: false},
      yborderid: {type: 'string', required: false},
      requestno: {type: 'string', required: false},
      status: {type: 'string', required: false},
      pageIndex: 'int',
      pageSize: 'int'
    }, ctx.query);

    // console.log('query:', ctx.query);

    const result = await service.finance.chargeList(ctx.query);
    if (ctx.query.is_export === 1) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet();
      worksheet.columns = excelInfo.chargeList.columns;
      worksheet.addRows(result.rows);
      ctx.response.attachment(excelInfo.chargeList.filename);
      ctx.status = 200;
      await workbook.xlsx.write(ctx.res);
      ctx.res.end();
    } else {
      ctx.body = result;
    }

  }

  async dealFlow() {
    const {ctx, service} = this;

    ctx.validate({
      is_export: 'int',
      id_string: {type: 'string', required: false},
      start_date: 'date',
      end_date: 'date',
      username: {type: 'string', required: false},
      nickname: {type: 'string', required: false},
      bill_type: {type: 'string', required: false},
      order_code: {type: 'string', required: false},
      pageIndex: 'int',
      pageSize: 'int'
    }, ctx.query);

    // console.log('query:', ctx.query);

    const result = await service.finance.dealFlow(ctx.query);
    if (ctx.query.is_export === 1) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet();
      worksheet.columns = excelInfo.dealFlow.columns;
      worksheet.addRows(result.rows);
      ctx.response.attachment(excelInfo.dealFlow.filename);
      ctx.status = 200;
      await workbook.xlsx.write(ctx.res);
      ctx.res.end();
    } else {
      ctx.body = result;
    }

  }

}

module.exports = FinanceController;
