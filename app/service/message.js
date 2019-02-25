'use strict';

const Service = require('egg').Service;

class Message extends Service {
  async sendMessage(body) {
    const arr = [];
    for (let i = 0; i < body.user_id_array.length; i++) {
      const user_id = body.user_id_array[i];
      if (body.is_push) {
        // 发推送
        // todo 这里可以用消息队列优化，否则消息发送完之前会阻塞在这里
        await this.ctx.service.getui.pushToSingle(user_id, body.content, body.title);
      }
      const msg = {
        title: body.title,
        is_read: '0',
        content: body.content,
        user_id,
      };
      arr.push(msg);
    }

    return await this.ctx.model.SysMessage.bulkCreate(arr);
  }

  async messageList(query) {
    const sql = `SELECT
                    m.*, u.username
                  FROM
                    sys_message m
                  LEFT JOIN uic_user u ON m.user_id = u.id
                  WHERE
                    m.deletedAt IS NULL `;
    let condition = '';
    if (query.username) condition += 'AND u.username LIKE CONCAT(\'%\', :username , \'%\') ';
    if (query.publish_date) condition += 'AND DATE(m.createdAt) = :publish_date ';
    const tail = `ORDER BY m.createdAt DESC 
                  LIMIT :offset,:limit;`;
    const rows = await this.ctx.model.query(sql + condition + tail, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        username: query.username,
        publish_date: query.publish_date,
        limit: query.pageSize,
        offset: query.pageSize * (query.pageIndex - 1)
      }
    });

    const sql2 = `SELECT
                    count(m.id) count
                  FROM
                    sys_message m
                  LEFT JOIN uic_user u ON m.user_id = u.id
                  WHERE
                    m.deletedAt IS NULL `;
    const count = await this.ctx.model.query(sql2 + condition, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        username: query.username,
        publish_date: query.publish_date,
      }
    });

    return {rows, count: count[0].count};
  }

  async messageEdit(id, body) {
    return await this.ctx.model.SysMessage.update(body, {where: {id}});
  }


}

module.exports = Message;