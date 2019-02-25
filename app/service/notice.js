'use strict';

const Service = require('egg').Service;

class Notice extends Service {
  async noticeAdd(body) {
    return await this.ctx.model.SysNotice.create(body);
  }

  async noticeList(query) {
    const sql = `SELECT
                    n.id,
                    n.title,
                    n.content,
                    n.isPublish,
                    n.isHomepage,
                    n.createdAt,
                    u.username
                  FROM
                    sys_notice n
                  LEFT JOIN uic_user u ON n.creator = u.id
                  WHERE
                    n.deletedAt IS NULL `;
    let condition = '';
    if (query.title) condition += 'AND n.title LIKE CONCAT("%", :title, "%") ';
    if (query.username) condition += 'AND u.username LIKE CONCAT(\'%\',:username,\'%\') ';
    if (query.publish_date) condition += 'AND DATE(n.createdAt) = :publish_date ';
    const tail = `ORDER BY n.createdAt DESC
                  LIMIT :offset,:limit;`;
    const rows = await this.ctx.model.query(sql + condition + tail, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        title: query.title,
        username: query.username,
        publish_date: query.publish_date,
        limit: query.pageSize,
        offset: query.pageSize * (query.pageIndex - 1)
      }
    });

    const sql2 = `SELECT
                    count(n.id) count
                  FROM
                    sys_notice n
                  LEFT JOIN uic_user u ON n.creator = u.id
                  WHERE
                    n.deletedAt IS NULL `;
    const count = await this.ctx.model.query(sql2 + condition, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        title: query.title,
        username: query.username,
        publish_date: query.publish_date,
      }
    });

    return {rows, count: count[0].count};
  }

  async batchDelete(body) {
    return await this.ctx.model.SysNotice.update({deletedAt: Date.now()}, {where: {id: {$in: body.id_array}}});
  }

}

module.exports = Notice;