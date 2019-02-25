'use strict';

const Controller = require('egg').Controller;
const excelInfo = require('../../config/excel');
const Excel = require('exceljs');

class OperateController extends Controller {

  async listOperate() {
    const {ctx, service} = this;

    ctx.validate({
      pageIndex: 'int',
      pageSize: 'int',
      username: {type: 'string', required: false},
      start_date: {type: 'datetime', required: false},
      end_date: {type: 'datetime', required: false},
    }, ctx.query);

    ctx.body = await service.operate.listOperate(ctx.query);

  }

  async userList() {
    const {ctx, service} = this;

    ctx.validate({
      pageIndex: 'int',
      pageSize: 'int',
      orderBy: ['id', 'username', 'createdAt'],
      order: ['DESC', 'ASC'],
      username: {type: 'string', required: false},
      nickname: {type: 'string', required: false},
      start_date: {type: 'date', required: false},
      end_date: {type: 'date', required: false},
      is_export: {type: 'int', required: false},
      id_string: {type: 'string', required: false},
    }, ctx.query);

    const result = await service.operate.userList(ctx.query);
    if (ctx.query.is_export) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet();
      worksheet.columns = excelInfo.userList.columns;
      worksheet.addRows(result.rows);
      ctx.response.attachment(excelInfo.userList.filename);
      ctx.status = 200;
      await workbook.xlsx.write(ctx.res);
      ctx.res.end();
    } else {
      ctx.body = result;
    }

  }

  async userFreeze() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.operate.userFreeze(ctx.params.id);

  }

  async userDetail() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.operate.userDetail(ctx.params.id);

  }

  async userLoginRecord() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      pageIndex: 'int',
      pageSize: 'int'
    }, Object.assign(ctx.params, ctx.query));

    ctx.body = await service.operate.userLoginRecord(ctx.params.id, ctx.query);

  }

  async rollList() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      pageIndex: 'int',
      pageSize: 'int'
    }, Object.assign(ctx.params, ctx.query));

    ctx.body = await service.operate.rollList(ctx.params.id, ctx.query);

  }

  async purchaseSelect() {
    const {ctx, service} = this;

    ctx.validate({
      is_export: 'int',
      id_string: {type: 'string', required: false},
      day_num: {type: 'int', required: false},
      max_times: {type: 'int', required: false},
      min_times: {type: 'int', required: false},
      max_purchase: {type: 'int', required: false},
      min_purchase: {type: 'int', required: false},
      product_type_code: {type: 'int', required: false},
      orderBy: ['username', 'order_moneys', 'order_counts', 'order_date'],
      order: ['DESC', 'ASC'],
      pageIndex: 'int',
      pageSize: 'int'
    }, ctx.query);

    // console.log('query:', ctx.query);

    const result = await service.operate.purchaseSelect(ctx.query);
    if (ctx.query.is_export) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet();
      worksheet.columns = excelInfo.purchaseSelect.columns;
      worksheet.addRows(result.rows);
      ctx.response.attachment(excelInfo.purchaseSelect.filename);
      ctx.status = 200;
      await workbook.xlsx.write(ctx.res);
      ctx.res.end();
    } else {
      ctx.body = result;
    }
  }

  async sendSms() {
    const {ctx, service} = this;

    ctx.validate({
      phone_numbers: {type: 'array', itemType: 'string', required: true}
    }, ctx.request.body);

    ctx.body = await service.sms.sendSMS({
      PhoneNumbers: ctx.request.body.phone_numbers.join(','), //必填:待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码,批量调用相对于单条调用及时性稍有延迟,验证码类型的短信推荐使用单条调用的方式；发送国际/港澳台消息时，接收号码格式为：国际区号+号码，如“85200000000”
      SignName: '中金e购', //必填:短信签名-可在短信控制台中找到
      TemplateCode: 'SMS_126358445', //必填:短信模板-可在短信控制台中找到，发送国际/港澳台消息时，请使用国际/港澳台短信模版
      TemplateParam: '{"code":"12345"}'//可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时。
    });
  }

  async sendMessage() {
    const {ctx, service} = this;

    ctx.validate({
      title: 'string',
      content: 'string',
      is_push: 'int',
      user_id_array: {type: 'array', itemType: 'int', required: true}
    }, ctx.request.body);

    ctx.body = await service.message.sendMessage(ctx.request.body);
  }

  async balanceFlow() {
    const {ctx, service} = this;

    ctx.validate({
      is_export: 'int',
      id_string: {type: 'string', required: false},
      user_id: 'int',
      pageIndex: 'int',
      pageSize: 'int'
    }, ctx.query);

    const result = await service.operate.balanceFlow(ctx.query);
    if (ctx.query.is_export) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet();
      worksheet.columns = excelInfo.balanceFlow.columns;
      worksheet.addRows(result.rows);
      ctx.response.attachment(excelInfo.balanceFlow.filename);
      ctx.status = 200;
      await workbook.xlsx.write(ctx.res);
      ctx.res.end();
    } else {
      ctx.body = result;
    }
  }

  async goldFlow() {
    const {ctx, service} = this;

    ctx.validate({
      is_export: 'int',
      id_string: {type: 'string', required: false},
      user_id: 'int',
      pageIndex: 'int',
      pageSize: 'int'
    }, ctx.query);

    const result = await service.operate.goldFlow(ctx.query);
    if (ctx.query.is_export) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet();
      worksheet.columns = excelInfo.goldFlow.columns;
      worksheet.addRows(result.rows);
      ctx.response.attachment(excelInfo.goldFlow.filename);
      ctx.status = 200;
      await workbook.xlsx.write(ctx.res);
      ctx.res.end();
    } else {
      ctx.body = result;
    }
  }

  async rollRequest() {
    const {ctx, service} = this;

    ctx.validate({
      p_product_id: 'int',
      value_type: ['0', '1'],
      rolls_value: 'number',
      rolls_days: 'int',
      valid_days: 'int',
      rolls_qty: 'int'
    }, ctx.request.body);
    ctx.request.body.rolls_source = 2;
    ctx.request.body.creator = ctx.user.id;
    ctx.request.body.state = 1;
    ctx.request.body.username = ctx.user.username;

    ctx.body = await service.operate.rollRequest(ctx.request.body);
  }

  async rollCoupon() {
    const {ctx, service} = this;

    ctx.validate({
      p_product_id: 'string',
      product_type_name: 'string',
      circulation: 'int',
      sill_type: 'int',
      sill_amount: 'int',
      sill_reward: 'number',
      sill_limit: 'int',
      days_limit: 'int'
    }, ctx.request.body);
    ctx.request.body.coupon_type = 3;
    ctx.request.body.coupon_name = '平台赠送红包';
    ctx.request.body.creator = ctx.user.id;
    // ctx.request.body.state = 1;

    console.log('query:', ctx.request.body);

    ctx.body = await service.operate.rollCoupon(ctx.request.body);
  }

  async templateList() {
    const {ctx, service} = this;

    ctx.validate({
      rolls_name: {type: 'string', required: false},
      pageIndex: 'int',
      pageSize: 'int',
    }, ctx.query);

    ctx.body = await service.operate.templateList(ctx.query);
  }

  async giveRoll() {
    const {ctx, service} = this;

    ctx.validate({
      user_id_array: {type: 'array', itemType: 'int', required: true},
      id: 'int',
      rolls_type: 'string',
    }, ctx.request.body);

    ctx.body = await service.operate.giveRoll(ctx.request.body);
  }

  async productNameList() {
    const {ctx, service} = this;

    ctx.body = await service.operate.productNameList();
  }

  async rollRequestList() {
    const {ctx, service} = this;

    ctx.validate({
      product_name: {type: 'string', required: false},
      value_type: ['0', '1', '-1'],
      pageIndex: 'int',
      pageSize: 'int',
    }, ctx.query);

    ctx.body = await service.roll.rollRequestList(ctx.query);
  }

  async couponList() {
    const {ctx, service} = this;

    ctx.validate({
      product_name: {type: 'string', required: false},
      sill_type: 'int',
      pageIndex: 'int',
      pageSize: 'int',
    }, ctx.query);

    ctx.body = await service.roll.couponList(ctx.query);
  }

  async couponDetail() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.roll.couponDetail(ctx.params.id);
  }

  async couponEdit() {
    const {ctx, service} = this;

    // ctx.request.body.coupon_name = '平台赠送红包';
    ctx.validate({
      id: 'int',
      p_product_id: 'string',
      product_type_name: 'string',
      circulation: 'int',
      sill_type: 'int',
      sill_amount: 'int',
      sill_reward: 'number',
      sill_limit: 'int',
      days_limit: 'int'
    }, Object.assign(ctx.params, ctx.request.body));
    // ctx.request.body.coupon_type = 3;
    // ctx.request.body.creator = ctx.user.id;
    // ctx.request.body.state = 1;
    ctx.body = await service.roll.couponEdit(ctx.params.id, ctx.request.body);
  }

  async couponDelete() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.roll.couponEdit(ctx.params.id, {delete_time: Date.now()});
  }

  async rollRequestDetail() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.roll.rollRequestDetail(ctx.params.id);
  }

  async rollRequestEdit() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      p_product_id: 'int',
      value_type: ['0', '1'],
      rolls_value: 'number',
      rolls_days: 'int',
      valid_days: 'int',
      rolls_qty: 'int'
    }, Object.assign(ctx.params, ctx.request.body));
    // ctx.request.body.rolls_source = 2;
    // ctx.request.body.creator = ctx.user.id;
    // ctx.request.body.state = 1;
    // ctx.request.body.username = ctx.user.username;

    ctx.body = await service.roll.rollRequestEdit(ctx.params.id, ctx.request.body);
  }

  async rollRequestDelete() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.roll.rollRequestEdit(ctx.params.id, {delete_time: Date.now()});
  }

  async rollRequestUseList() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      username: {type: 'string', required: false},
      use_state: ['0', '1', '3', '-1'],
      pageIndex: 'int',
      pageSize: 'int',
    }, ctx.query);

    ctx.body = await service.roll.rollRequestUseList(ctx.query);
  }

  async noticeAdd() {
    const {ctx, service} = this;

    ctx.validate({
      title: 'string',
      content: 'string',
      isPublish: 'string',
      isHomepage: 'string',
    }, ctx.request.body);
    ctx.request.body.creator = ctx.user.id;

    ctx.body = await service.notice.noticeAdd(ctx.request.body);
  }

  async noticeList() {
    const {ctx, service} = this;

    ctx.validate({
      title: {type: 'string', required: false},
      username: {type: 'string', required: false},
      publish_date: {type: 'date', required: false},
      pageIndex: 'int',
      pageSize: 'int',
    }, ctx.query);

    ctx.body = await service.notice.noticeList(ctx.query);
  }

  async messageList() {
    const {ctx, service} = this;

    ctx.validate({
      username: {type: 'string', required: false},
      publish_date: {type: 'date', required: false},
      pageIndex: 'int',
      pageSize: 'int',
    }, ctx.query);

    ctx.body = await service.message.messageList(ctx.query);
  }

  async messageDelete() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.message.messageEdit(ctx.params.id, {deletedAt: Date.now()});
  }

  async batchDelete() {
    const {ctx, service} = this;

    ctx.validate({
      id_array: {type: 'array', itemType: 'int', required: true}
    }, ctx.request.body);

    ctx.body = await service.notice.batchDelete(ctx.request.body);
  }

  async stsToken() {
    const {ctx, service} = this;

    ctx.body = await service.oss.stsToken();
  }

  async bannerAdd() {
    const {ctx, service} = this;

    ctx.validate({
      title: 'string',
      category: ['1', '2', '3'],
      img_url: 'string',
      img_alt: 'string',
      img_jump_link: 'string',
      is_enable: ['0', '1'],
      sort: 'int',
    }, ctx.request.body);

    ctx.body = await service.banner.bannerAdd(ctx.request.body);
  }

  async bannerEdit() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      title: 'string',
      category: ['1', '2', '3'],
      img_url: 'string',
      img_alt: 'string',
      img_jump_link: 'string',
      is_enable: ['0', '1'],
      sort: 'int',
    }, Object.assign(ctx.params, ctx.request.body));

    ctx.body = await service.banner.bannerEdit(ctx.params.id, ctx.request.body);
  }

  async bannerEnable() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      is_enable: ['0', '1']
    }, Object.assign(ctx.params, ctx.request.body));

    ctx.body = await service.banner.bannerEdit(ctx.params.id, ctx.request.body);
  }

  async bannerDelete() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.banner.bannerEdit(ctx.params.id, {delete_time: Date.now()});
  }

  async bannerList() {
    const {ctx, service} = this;

    ctx.validate({
      title: {type: 'string', required: false},
      category: ['-1', '1', '2', '3'],
      pageIndex: 'int',
      pageSize: 'int',
    }, ctx.query);

    ctx.body = await service.banner.bannerList(ctx.query);
  }

  async dynamicAdd() {
    const {ctx, service} = this;

    ctx.validate({
      title: 'string',
      detail: 'string',
      list_img_url: 'string',
      banner_img_url: 'string',
      state: ['0', '1'],
      classify: 'int',
    }, ctx.request.body);
    ctx.request.body.author_user_id = ctx.user.id;
    ctx.request.body.author_nickname = ctx.user.username;

    ctx.body = await service.dynamic.dynamicAdd(ctx.request.body);
  }

  async dynamicEdit() {
    const {ctx, service} = this;

    ctx.validate({
      title: 'string',
      detail: 'string',
      list_img_url: 'string',
      banner_img_url: 'string',
      state: ['0', '1'],
      classify: 'int',
    }, Object.assign(ctx.params, ctx.request.body));

    ctx.body = await service.dynamic.dynamicEdit(ctx.params.id, ctx.request.body);
  }

  async dynamicDelete() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.dynamic.dynamicEdit(ctx.params.id, {delete_time: Date.now()});
  }

  async dynamicEnable() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      state: ['0', '1']
    }, Object.assign(ctx.params, ctx.request.body));

    ctx.body = await service.dynamic.dynamicEdit(ctx.params.id, ctx.request.body);
  }

  async dynamicList() {
    const {ctx, service} = this;

    ctx.validate({
      title: {type: 'string', required: false},
      category: ['-1', '1', '2', '3'],
      orderBy: ['create_time', 'update_time', 'click_amount'],
      order: ['DESC', 'ASC'],
      pageIndex: 'int',
      pageSize: 'int',
    }, ctx.query);

    ctx.body = await service.dynamic.dynamicList(ctx.query);
  }

  async dynamicDetail() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.dynamic.dynamicDetail(ctx.params.id);
  }

  async feedbackList() {
    const {ctx, service} = this;

    ctx.validate({
      username: {type: 'string', required: false},
      state: ['-1', '0', '1', '2'],
      is_effect: 'int',
      orderBy: ['createdAt', 'dispose_at'],
      order: ['DESC', 'ASC'],
      pageIndex: 'int',
      pageSize: 'int',
    }, ctx.query);

    ctx.body = await service.feedback.feedbackList(ctx.query);
  }

  async feedbackDispose() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      is_effect: 'int',
      state: ['0', '1', '2'],
      reply: {type: 'string', required: false},
    }, Object.assign(ctx.params, ctx.request.body));
    ctx.request.body.reply_user_id = ctx.user.id;

    if (ctx.request.body.state === '1' && !ctx.request.body.reply) ctx.throw(200, '回复内容不能为空!');

    ctx.body = await service.feedback.feedbackDispose(ctx.params.id, ctx.request.body);
  }

  async feedbackDelete() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.feedback.feedbackEdit(ctx.params.id, {deletedAt: Date.now()});
  }

  async questionAdd() {
    const {ctx, service} = this;

    ctx.validate({
      type: 'int',
      question: 'string',
      answer: 'string',
      is_display: 'int'
    }, ctx.request.body);
    ctx.request.body.creator = ctx.user.id;

    ctx.body = await service.helpCenter.questionAdd(ctx.request.body);
  }

  async questionEdit() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      type: 'int',
      question: 'string',
      answer: 'string',
      is_display: 'int'
    }, Object.assign(ctx.params, ctx.request.body));

    ctx.body = await service.helpCenter.questionEdit(ctx.params.id, ctx.request.body);
  }

  async questionEnable() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
      is_display: 'int'
    }, Object.assign(ctx.params, ctx.request.body));

    ctx.body = await service.helpCenter.questionEdit(ctx.params.id, ctx.request.body);
  }

  async questionDelete() {
    const {ctx, service} = this;

    ctx.validate({
      id: 'int',
    }, ctx.params);

    ctx.body = await service.helpCenter.questionEdit(ctx.params.id, {delete_time: Date.now()});
  }

  async questionList() {
    const {ctx, service} = this;

    ctx.validate({
      question: {type: 'string', required: false},
      type: 'int',
      pageIndex: 'int',
      pageSize: 'int',
    }, ctx.query);

    ctx.body = await service.helpCenter.questionList(ctx.query);
  }

  async statisticList() {
    const {ctx, service} = this;

    ctx.validate({
      username: {type: 'string', required: false},
      nickname: {type: 'string', required: false},
      orderBy: ['not_use', 'already_use', 'invalid', 'over_date'],
      order: ['DESC', 'ASC'],
      pageIndex: 'int',
      pageSize: 'int',
    }, ctx.query);

    ctx.body = await service.roll.statisticList(ctx.query);
  }

  async inviteList() {
    const {ctx, service} = this;

    ctx.validate({
      is_export: 'int',
      id_string: {type: 'string', required: false},
      username: {type: 'string', required: false},
      nickname: {type: 'string', required: false},
      orderBy: ['success_invite', 'success_deal'],
      order: ['DESC', 'ASC'],
      pageIndex: 'int',
      pageSize: 'int',
    }, ctx.query);

    const result = await service.user.inviteList(ctx.query);
    if (ctx.query.is_export) {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet();
      worksheet.columns = excelInfo.inviteStatistic.columns;
      worksheet.addRows(result.rows);
      ctx.response.attachment(excelInfo.inviteStatistic.filename);
      ctx.status = 200;
      await workbook.xlsx.write(ctx.res);
      ctx.res.end();
    } else {
      ctx.body = result;
    }
  }

}

module.exports = OperateController;
