'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class Feedback extends Service {

  async feedbackList(query) {
    const sql = `SELECT
                    f.id,
                    u.username,
                    f.createdAt,
                    f.state,
                    f.content,
                    IFNULL(f.is_effect, '-') is_effect,
                    IFNULL(f.dispose_at, '-') dispose_at
                  FROM
                    sys_feedback f
                  LEFT JOIN uic_user u ON f.user_id = u.id
                  WHERE
                    f.deletedAt IS NULL `;
    let condition = '';
    if (query.username) condition += 'AND u.username LIKE CONCAT(\'%\', :username , \'%\') ';
    if (query.state !== '-1') condition += 'AND f.state = :state ';
    if (query.is_effect !== -1) condition += 'AND f.is_effect = :is_effect ';
    const tail = `ORDER BY f.${query.orderBy} ${query.order}
                  LIMIT :offset,:limit;`;
    const rows = await this.ctx.model.query(sql + condition + tail, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        username: query.username,
        state: query.state,
        is_effect: query.is_effect,
        limit: query.pageSize,
        offset: query.pageSize * (query.pageIndex - 1)
      }
    });

    const sql2 = `SELECT
                    count(f.id) count
                  FROM
                    sys_feedback f
                  LEFT JOIN uic_user u ON f.user_id = u.id
                  WHERE
                    f.deletedAt IS NULL `;
    const count = await this.ctx.model.query(sql2 + condition, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        username: query.username,
        state: query.state,
        is_effect: query.is_effect,
      }
    });

    return {rows, count: count[0].count};
  }

  async feedbackDispose(id, body) {
    const feedback = await this.ctx.model.SysFeedback.findById(id);
    if (!feedback) this.ctx.throw(404, '该用户发反馈不存在！');
    const tran = await this.ctx.model.transaction();
    try {
      const result = await this.ctx.model.SysFeedback.update(body, {where: {id}, transaction: tran});
      if (body.state === '1') {
        await this.ctx.model.SysMessage.create({
          title: '反馈回复',
          sub_title: '反馈回复',
          content: `您好! 您在${moment(feedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}提交的反馈已经被回复，回复内容为：${body.reply}`,
          user_id: feedback.user_id,
          push: 0
        }, {transaction: tran});
      }
      await tran.commit();
      return result;
    } catch (e) {
      await tran.rollback();
      throw e;
    }
  }

  async feedbackEdit(id, body) {
    return await this.ctx.model.SysFeedback.update(body, {where: {id}});
  }


}

module.exports = Feedback;