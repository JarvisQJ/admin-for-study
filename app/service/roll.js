'use strict';

const Service = require('egg').Service;

class Roll extends Service {
  async rollRequestList(query) {
    const sql = `SELECT a.id,
                        b.id p_product_id,
                       b.name AS product_name,
                       CASE a.value_type
                       WHEN '0' THEN '保值'
                       WHEN '1' THEN '保价' 
                       END AS value_type,
                       CONCAT(rolls_value,'%') AS rolls_value,
                       rolls_days,
                       valid_days,
                       rolls_qty
                FROM rolls_request a,
                     p_product b
                WHERE a.p_product_id=b.id
                AND   rolls_source=2 `;
    let condition = '';
    if (query.product_name) condition += 'AND   b.`name` LIKE CONCAT(\'%\',:product_name,\'%\') ';
    if (query.value_type !== '-1') condition += 'AND   value_type=:value_type ';
    const tail = 'LIMIT :offset,:limit;';
    const rows = await this.ctx.model.query(sql + condition + tail, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        product_name: query.product_name,
        value_type: query.value_type,
        limit: query.pageSize,
        offset: query.pageSize * (query.pageIndex - 1)
      }
    });

    const sql2 = `SELECT count(a.id) count
                FROM rolls_request a,
                     p_product b
                WHERE a.p_product_id=b.id
                AND   rolls_source=2 `;
    const count = await this.ctx.model.query(sql2 + condition, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        product_name: query.product_name,
        value_type: query.value_type,
      }
    });

    return {rows, count: count[0].count};
  }

  async couponList(query) {
    const sql = `SELECT coupon_id,
                        a.id,
                        b.id p_product_id,
                       b.name AS product_name,
                       CASE sill_type
                       WHEN 0 THEN '无限制'
                       WHEN 1 THEN '满元可用'
                       WHEN 2 THEN '满克可用' 
                       END AS sill_type,
                       CONCAT(sill_reward,'元') AS sill_reward,
                       sill_amount,
                       days_limit,
                       sill_limit,
                       circulation       
                FROM coupon_config a,
                     p_product b
                WHERE a.p_product_id=b.id 
                AND   a.coupon_type=3 `;
    let condition = '';
    if (query.product_name) condition += 'AND   b.`name` LIKE CONCAT(\'%\',:product_name,\'%\') ';
    if (query.sill_type !== -1) condition += 'AND   sill_type=:sill_type ';
    const tail = 'LIMIT :offset,:limit;';
    const rows = await this.ctx.model.query(sql + condition + tail, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        product_name: query.product_name,
        sill_type: query.sill_type,
        limit: query.pageSize,
        offset: query.pageSize * (query.pageIndex - 1)
      }
    });

    const sql2 = `SELECT count(coupon_id) count       
                FROM coupon_config a,
                     p_product b
                WHERE a.p_product_id=b.id 
                AND   a.coupon_type=3 `;
    const count = await this.ctx.model.query(sql2 + condition, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        product_name: query.product_name,
        sill_type: query.sill_type,
      }
    });

    return {rows, count: count[0].count};
  }

  async couponDetail(id) {
    const baseInfo = await this.ctx.model.CouponConfig.findOne({where: {coupon_id: id}});
    if (!baseInfo) this.ctx.throw(401, '找不到资源！');
    const haveGive = await this.ctx.model.ProductRolls.count({where: {coupon_id: id}});
    const haveUse = await this.ctx.model.ProductRolls.count({where: {coupon_id: id, s_order_id: {$ne: null}}});

    return Object.assign(baseInfo.dataValues, {
      haveGive,
      toGive: baseInfo.circulation - haveGive,
      haveUse,
      toUse: haveGive - haveUse,
    });
  }

  async couponEdit(id, body) {
    return await this.ctx.model.CouponConfig.update(body, {where: {id}});
  }

  async rollRequestDetail(id) {
    const baseInfo = await this.ctx.model.RollsRequest.findOne({where: {id}});
    if (!baseInfo) this.ctx.throw(401, '找不到资源！');
    const haveGive = await this.ctx.model.ProductRolls.count({where: {coupon_id: id}});
    const haveUse = await this.ctx.model.ProductRolls.count({where: {coupon_id: id, s_order_id: {$ne: null}}});

    return Object.assign(baseInfo.dataValues, {
      haveGive,
      toGive: baseInfo.rolls_qty - haveGive,
      haveUse,
      toUse: haveGive - haveUse,
    });
  }

  async rollRequestEdit(id, body) {
    return await this.ctx.model.RollsRequest.update(body, {where: {id}});
  }

  async rollRequestUseList(query) {
    const sql = `SELECT c.username,
                       a.create_time,
                       CASE is_use 
                       WHEN '0' THEN '未使用'
                       WHEN '1' THEN '已使用'
                       WHEN '3' THEN '已过期'
                       END AS is_use,
                       IFNULL(b.createdAt,'-') AS use_time,
                       IFNULL(b.code,'-') AS order_no,
                       IFNULL(b.id,'-') AS order_id
                FROM (SELECT user_id,
                             create_time,
                             CASE WHEN is_use='0' AND end_date<CURDATE() THEN '3'
                             ELSE is_use 
                             END AS is_use,
                             coupon_id,
                             s_order_id FROM product_rolls) a
                LEFT JOIN s_order b ON a.s_order_id=b.id
                JOIN      uic_user c
                WHERE a.user_id=c.id
                AND a.coupon_id=:id `;
    let condition = '';
    if (query.username) condition += 'AND c.username LIKE CONCAT(\'%\',:username,\'%\') ';
    if (query.use_state !== '-1') condition += 'AND is_use =:use_state ';
    const tail = `ORDER BY create_time DESC
                  LIMIT :offset,:limit;`;
    const rows = await this.ctx.model.query(sql + condition + tail, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id: query.id,
        username: query.username,
        use_state: query.use_state,
        limit: query.pageSize,
        offset: query.pageSize * (query.pageIndex - 1)
      }
    });

    const sql2 = `SELECT count(c.username) count
                FROM (SELECT user_id,
                             create_time,
                             CASE WHEN is_use='0' AND end_date<CURDATE() THEN '3'
                             ELSE is_use 
                             END AS is_use,
                             coupon_id,
                             s_order_id FROM product_rolls) a
                LEFT JOIN s_order b ON a.s_order_id=b.id
                JOIN      uic_user c
                WHERE a.user_id=c.id
                AND a.coupon_id=:id `;
    const count = await this.ctx.model.query(sql2 + condition, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id: query.id,
        username: query.username,
        use_state: query.use_state,
      }
    });

    return {rows, count: count[0].count};
  }

  async statisticList(query) {
    const sql = `SELECT
                    u.username,
                    u.nickname,
                    a.*
                  FROM
                    (
                      SELECT
                        user_id,
                        COUNT(use_state = '0' OR NULL) not_use,
                        COUNT(use_state = '1' OR NULL) already_use,
                        COUNT(use_state = '2' OR NULL) invalid,
                        COUNT(use_state = '3' OR NULL) over_date
                      FROM
                        (
                          SELECT
                            user_id,
                            CASE
                          WHEN is_use = '0'
                          AND end_date < CURDATE() THEN
                            3
                          ELSE
                            is_use
                          END AS use_state
                          FROM
                            product_rolls
                          WHERE
                            user_id IS NOT NULL
                        ) r
                      GROUP BY
                        user_id
                    ) a
                  LEFT JOIN uic_user u ON a.user_id = u.id
                  WHERE
                    1 = 1 `;
    let condition = '';
    if (query.username) condition += 'AND u.username LIKE CONCAT(\'%\',:username,\'%\') ';
    if (query.nickname) condition += 'AND u.nickname LIKE CONCAT(\'%\',:nickname,\'%\') ';
    const tail = `ORDER BY ${query.orderBy} ${query.order}
                  LIMIT :offset,:limit;`;
    const rows = await this.ctx.model.query(sql + condition + tail, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        username: query.username,
        nickname: query.nickname,
        limit: query.pageSize,
        offset: query.pageSize * (query.pageIndex - 1)
      }
    });

    const sql2 = `SELECT
                    count(user_id) count
                  FROM
                    (
                      SELECT
                        user_id,
                        COUNT(use_state = '0' OR NULL) not_use,
                        COUNT(use_state = '1' OR NULL) already_use,
                        COUNT(use_state = '2' OR NULL) invalid,
                        COUNT(use_state = '3' OR NULL) over_date
                      FROM
                        (
                          SELECT
                            user_id,
                            CASE
                          WHEN is_use = '0'
                          AND end_date < CURDATE() THEN
                            3
                          ELSE
                            is_use
                          END AS use_state
                          FROM
                            product_rolls
                          WHERE
                            user_id IS NOT NULL
                        ) r
                      GROUP BY
                        user_id
                    ) a
                  LEFT JOIN uic_user u ON a.user_id = u.id
                  WHERE
                    1 = 1 `;
    const count = await this.ctx.model.query(sql2 + condition, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        username: query.username,
        nickname: query.nickname,
      }
    });

    return {rows, count: count[0].count};
  }


}

module.exports = Roll;