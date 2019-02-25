'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class Operate extends Service {
  async listOperate(query) {
    const condition = {};
    if (query.username) condition.creator = {$like: `%${query.username}%`};
    if (query.start_date && query.end_date) condition.create_time = {$between: [query.start_date, query.end_date]};
    return await this.ctx.model.OperationLog.findAndCountAll({
      where: condition,
      order: [
        ['create_time', 'DESC']
      ],
      limit: query.pageSize,
      offset: query.pageSize * (query.pageIndex - 1)
    });
  }

  async createOperateRecord(model) {
    return await this.ctx.model.OperationLog.create(model);
  }

  async userList(query) {

    const sql = `SELECT id,#用户ID
                       username,#账号
                       IFNULL(nickname,'-') nickname,#姓名
                       date_format(createdAt,'%Y-%m-%d %H:%i:%s') createdAt,#创建时间
                       usertype#账户启用状态
                FROM uic_user 
                WHERE usertype IN (2,10) `;
    let condition = '';
    let tail = `ORDER BY ${query.orderBy} ${query.order} `;
    if (query.username) condition += 'AND username LIKE CONCAT(\'%\',:username,\'%\') ';
    if (query.nickname) condition += 'AND nickname LIKE CONCAT(\'%\',:nickname,\'%\') ';
    if (query.start_date && query.end_date) condition += 'AND createdAt>=:start_date AND createdAt<DATE_ADD(:end_date,INTERVAL 1 DAY) ';
    if (query.is_export === 1) {
      if (query.id_string.split(',')[0].length !== 0) condition += 'AND  FIND_IN_SET(id,:id_string) ';
    } else {
      tail += 'LIMIT :offset ,:pageSize;';
    }
    const rows = await this.ctx.model.query(sql + condition + tail, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id_string: query.id_string,
        offset: query.pageSize * (query.pageIndex - 1),
        pageSize: query.pageSize,
        username: query.username,
        nickname: query.nickname,
        start_date: query.start_date,
        end_date: query.end_date,
      }
    });

    const sql2 = `SELECT count(id) count
                FROM uic_user 
                WHERE usertype IN (2,10)`;
    const count = await this.ctx.model.query(sql2 + condition, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id_string: query.id_string,
        username: query.username,
        nickname: query.nickname,
        start_date: query.start_date,
        end_date: query.end_date
      }
    });

    return {rows, count: count[0].count};

  }

  async userFreeze(id) {
    const user = await this.ctx.model.UicUser.findById(id);
    if (!user) this.ctx.throw(406, '找不到该用户！');
    if (user.usertype === 2) {
      user.usertype = 10;
      return await user.save();
    } else if (user.usertype === 10) {
      user.usertype = 2;
      return await user.save();
    }
  }

  async userDetail(id) {
    //用户基本信息
    const sql = `SELECT a.id,#ID
                       a.username,#账号
                       a.nickname,#姓名
                       CASE MOD(SUBSTR(b.identity_card FROM 17 FOR 1),2) WHEN 0 THEN '女' WHEN 1 THEN '男' END AS sex,#性别
                       CONCAT(SUBSTR(b.identity_card FROM 7 FOR 4),'年',SUBSTR(b.identity_card FROM 11 FOR 2),'月',SUBSTR(b.identity_card FROM 13 FOR 2),'日') AS birth_date,#生日
                       IFNULL(b.identity_card_address,CONCAT(a.register_province,a.register_city)) AS city,#城市
                       a.createdAt as register_time,#注册时间
                       CASE a.source WHEN 9 THEN '官网' ELSE 'APP' END AS source#用户来源
                FROM uic_user a
                LEFT JOIN user_authentication b
                ON a.id=b.user_id
                AND b.state='1'
                WHERE a.id=:id;`;
    const baseInfo = await this.ctx.model.query(sql, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id
      }
    });

    //收货地址
    const address = await this.ctx.service.address.findAddressByUserId(id);

    //用户个人统计信息
    const statInfo = await this.ctx.model.query(`
    SELECT SUM(real_money) AS invest_money,#投资金额
       COUNT(id) AS orders,#订单笔数
       SUM(weight) as weights,#买入总克数
      (SELECT SUM(weight) FROM s_order WHERE product_type_code=1 AND \`status\`=2 AND uic_user_id=3082) AS lt_weights,#流通金
      (SELECT SUM(weight) FROM s_order WHERE product_type_code in (2,4,100) AND \`status\`=2 AND uic_user_id=3082) AS cb_weights,#储备金
      (SELECT SUM(weight) FROM s_order WHERE product_type_code=3 AND \`status\`=2 AND uic_user_id=3082) as wl_weights,#未来金
      (SELECT SUM(weight) FROM s_bill WHERE bill_type IN (9,13,17,19) AND uic_user_id=3082) AS award_weights#系统赏金
      FROM s_order 
      WHERE \`status\`=2
      AND uic_user_id=:id;`, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id
      }
    });
    if (baseInfo.length === 0 || statInfo === 0) this.ctx.throw(401, '找不到资源！');
    return Object.assign(baseInfo[0], statInfo[0], {addressList: address});

  }

  async userLoginRecord(id, query) {
    return await this.ctx.model.UicLogin.findAndCountAll({
      where: {user: id},
      order: [
        ['createdAt', 'DESC']
      ],
      limit: parseInt(query.pageSize),
      offset: query.pageSize * (query.pageIndex - 1)
    });
  }

  async rollList(id, query) {
    const sql = `SELECT DISTINCT b.type_name,#黄金品类
                          CASE a.rolls_type WHEN '1' THEN '加息卷' WHEN '2' THEN '返现红包' ELSE '-' END AS rolls_type,#红包类型
                          CASE a.value_type WHEN '0' THEN '保值' WHEN '1' THEN '保价' ELSE '-' END as value_type,#保值/保价
                          CASE a.rolls_type WHEN '1' THEN CONCAT(rolls_value,'%') WHEN '2' THEN CONCAT(rolls_value,'元') END AS rolls_money,#金额
                          COUNT(1) count,#数量
                          CASE is_use WHEN '1' THEN '已使用' WHEN '2' THEN '已失效' ELSE (CASE WHEN a.end_date<=CURDATE() THEN '已过期' ELSE '未使用' END) END AS state#状态
                  FROM product_rolls a,
                       p_product b
                  WHERE FIND_IN_SET(b.id,a.p_product_id) 
                  AND a.delete_time IS NULL
                  AND a.user_id=3082
                  LIMIT :offset,:limit;`;
    return await this.ctx.model.query(sql, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id,
        limit: parseInt(query.pageSize),
        offset: query.pageSize * (query.pageIndex - 1)
      }
    });
  }

  async purchaseSelect(query) {
    const sql = `SELECT s.id,
                         s.username,
                         sum(order_moneys) order_moneys,
                         sum(order_counts) order_counts,
                         max(order_date) order_date
                  FROM
                        (SELECT
														uic_user_id,
														CASE product_type_code 
														WHEN 4 THEN 2 
														ELSE product_type_code 
														END AS type_code,
														COUNT(id) AS order_counts,
														SUM(real_money) AS order_moneys,
														max(order_date) AS order_date
														FROM
														s_order
														WHERE
														\`status\` = 2
														GROUP BY
														uic_user_id,
														type_code) k,
                            uic_user s
                  WHERE k.uic_user_id=s.id `;
    let condition = '';
    let tail = `GROUP BY s.id,s.username ORDER BY ${query.orderBy} ${query.order} `;
    if (query.day_num) condition += 'AND order_date>=DATE_SUB(CURDATE(),INTERVAL :day_num DAY) ';
    if (query.min_times) condition += 'AND   order_counts>=:min_times ';
    if (query.max_times) condition += 'AND   order_counts<=:max_times ';
    if (query.min_purchase) condition += 'AND   order_moneys>=:min_purchase ';
    if (query.max_purchase) condition += 'AND   order_moneys<=:max_purchase ';
    if (query.product_type_code) condition += 'AND   type_code=:product_type_code ';
    if (query.is_export === 1) {
      if (query.id_string.split(',')[0].length !== 0) condition += 'AND  FIND_IN_SET(id,:id_string) ';
    } else {
      tail += 'LIMIT :offset,:limit;';
    }
    const rows = await this.ctx.model.query(sql + condition + tail, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id_string: query.id_string,
        day_num: query.day_num,
        min_times: query.min_times,
        max_times: query.max_times,
        min_purchase: query.min_purchase,
        max_purchase: query.max_purchase,
        product_type_code: query.product_type_code,
        limit: query.pageSize,
        offset: query.pageSize * (query.pageIndex - 1)
      }
    });

    const sql2 = `SELECT count(id) count
                  FROM
                        (SELECT
														uic_user_id,
														CASE product_type_code 
														WHEN 4 THEN 2 
														ELSE product_type_code 
														END AS type_code,
														COUNT(id) AS order_counts,
														SUM(real_money) AS order_moneys,
														max(order_date) AS order_date
														FROM
														s_order
														WHERE
														\`status\` = 2
														GROUP BY
														uic_user_id,
														type_code) k,
                            uic_user s
                  WHERE k.uic_user_id=s.id `;
    const count = await this.ctx.model.query(sql2 + condition, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id_string: query.id_string,
        day_num: query.day_num,
        min_times: query.min_times,
        max_times: query.max_times,
        min_purchase: query.min_purchase,
        max_purchase: query.max_purchase,
        product_type_code: query.product_type_code
      }
    });

    return {rows, count: count[0].count};
  }

  async balanceFlow(query) {
    const sql = `SELECT 
                       a.id,
                       b.username,
                       b.nickname,
                       a.createdAt,
                       CASE WHEN bill_type IN (2,4,8,16,18,20,27) THEN ABS(money) ELSE 0 END AS money_in,
                       CASE WHEN bill_type IN (1,3,11,24) THEN ABS(money) ELSE 0 END AS money_out,
                       a.current_balance,#余额
                       CASE bill_type 
                       WHEN 1 THEN '买入' 
                       WHEN 2 THEN '卖出'
                       WHEN 3 THEN '充值'
                       WHEN 4 THEN '提现'
                       WHEN 8 THEN '利息'
                       WHEN 11 THEN '线下充值'
                       WHEN 16 THEN '分销提成'
                       WHEN 18 THEN '现金奖励'
                       WHEN 20 THEN '免盯盘返还没用完的金额'
                       WHEN 24 THEN '信用金克减手续费'
                       WHEN 27 THEN '集字返现'
                       END AS bill_type,#交易类型
                       a.summary  #摘要 
                FROM s_bill a,
                     uic_user b
                WHERE a.uic_user_id=b.id
                AND   a.bill_type IN (1,2,3,4,8,11,16,18,20,24,27)
                AND   b.id=:user_id `;
    let condition = '';
    let tail = 'ORDER BY a.createdAt ';
    if (query.is_export === 1) {
      if (query.id_string.split(',')[0].length !== 0) condition += 'AND  FIND_IN_SET(a.id,:id_string) ';
    } else {
      tail += 'LIMIT :offset,:limit;';
    }
    const rows = await this.ctx.model.query(sql + condition + tail, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id_string: query.id_string,
        user_id: query.user_id,
        limit: query.pageSize,
        offset: query.pageSize * (query.pageIndex - 1)
      }
    });

    const sql2 = `SELECT count(a.id) count
                FROM s_bill a,
                     uic_user b
                WHERE a.uic_user_id=b.id
                AND   a.bill_type IN (1,2,3,4,8,11,16,18,20,24,27)
                AND   b.id=:user_id`;
    const count = await this.ctx.model.query(sql2, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id_string: query.id_string,
        user_id: query.user_id
      }
    });

    return {rows, count: count[0].count};
  }

  async goldFlow(query) {
    const sql = `SELECT
                    id,#流水ID
                    order_no,#订单编号
                    username,#用户账号
                    nickname,#用户姓名
                    createdAt,#交易时间
                    bill_type,#交易类型
                    CASE product_type
                  WHEN 1 THEN
                    '流通金'
                  WHEN 2 THEN
                    '储备金'
                  WHEN 1 THEN
                    '未来金'
                  WHEN 1 THEN
                    '稳赚金'
                  END AS product_type,#产品分类
                   p_product_name,#产品名称
                   weight_in,#黄金转入
                   weight_out,#黄金转出
                   current_gold_weight,#黄金资产
                   summary#摘要
                  FROM
                    (
                      SELECT
                        b.id,
                        a.CODE AS order_no,
                        c.username,
                        c.nickname,
                        b.createdAt,
                        '买入' AS bill_type,
                        product_type,
                        p_product_name,
                        ABS(b.weight) AS weight_in,
                        0 AS weight_out,
                        b.current_gold_weight,
                        b.summary
                      FROM
                        s_order a,
                        s_bill b,
                        uic_user c
                      WHERE
                        a.id = b.s_order_id
                      AND b.uic_user_id = c.id
                      AND b.bill_type = 1 #买入
                      AND c.id = :user_id
                      UNION ALL
                        SELECT
                          b.id,
                          a.order_no,
                          c.username,
                          c.nickname,
                          b.createdAt,
                          '存金' AS bill_type,
                          product_type,
                          p_product_name,
                          ABS(b.weight) AS weight_in,
                          0 AS weight_out,
                          b.current_gold_weight,
                          b.summary
                        FROM
                          t_deposit_gold a,
                          s_bill b,
                          uic_user c
                        WHERE
                          a.id = b.s_order_id
                        AND b.uic_user_id = c.id
                        AND b.bill_type = 5 #存金
                        AND c.id = :user_id
                        UNION ALL
                          SELECT
                            b.id,
                            a.order_no,
                            c.username,
                            c.nickname,
                            b.createdAt,
                            '线上提金' AS bill_type,
                            product_type,
                            p_product_name,
                            0 AS weight_in,
                            ABS(b.weight) AS weight_out,
                            b.current_gold_weight,
                            b.summary
                          FROM
                            tijin_order_online a,
                            s_bill b,
                            uic_user c
                          WHERE
                            a.id = b.s_order_id
                          AND b.uic_user_id = c.id
                          AND b.bill_type = 6 #线上提金
                          AND c.id = :user_id
                          UNION ALL
                            SELECT
                              b.id,
                              a.order_no,
                              c.username,
                              c.nickname,
                              b.createdAt,
                              '线下提金' AS bill_type,
                              product_type,
                              p_product_name,
                              0 AS weight_in,
                              ABS(b.weight) AS weight_out,
                              b.current_gold_weight,
                              b.summary
                            FROM
                              tijin_order_offline a,
                              s_bill b,
                              uic_user c
                            WHERE
                              a.id = b.s_order_id
                            AND b.uic_user_id = c.id
                            AND b.bill_type = 12 #线下提金
                            AND c.id = :user_id
                            UNION ALL
                              SELECT
                                b.id,
                                a.order_no,
                                c.username,
                                c.nickname,
                                b.createdAt,
                                '饰品金提金' AS bill_type,
                                product_type,
                                p_product_name,
                                0 AS weight_in,
                                ABS(b.weight) AS weight_out,
                                b.current_gold_weight,
                                b.summary
                              FROM
                                decoration_order a,
                                s_bill b,
                                uic_user c
                              WHERE
                                a.id = b.s_order_id
                              AND b.uic_user_id = c.id
                              AND b.bill_type = 14 #饰品金提金
                              AND c.id = :user_id
                              UNION ALL
                                SELECT
                                  b.id,
                                  a.order_no,
                                  c.username,
                                  c.nickname,
                                  b.createdAt,
                                  CASE bill_type
                                WHEN 21 THEN
                                  'K收'
                                ELSE
                                  'K付'
                                END AS bill_type,
                                product_type,
                                p_product_name,
                                CASE bill_type
                              WHEN 21 THEN
                                ABS(b.weight)
                              ELSE
                                0
                              END AS weight_in,
                              CASE bill_type
                            WHEN 21 THEN
                              0
                            ELSE
                              ABS(b.weight)
                            END AS weight_out,
                            b.current_gold_weight,
                            b.summary
                          FROM
                            t_kpay a,
                            s_bill b,
                            uic_user c
                          WHERE
                            a.id = b.s_order_id
                          AND b.uic_user_id = c.id
                          AND b.bill_type IN (21, 22) #K收和K付
                          AND c.id = :user_id
                          UNION ALL
                            SELECT
                              b.id,
                              '' AS order_no,
                              c.username,
                              c.nickname,
                              b.createdAt,
                              CASE bill_type
                            WHEN 2 THEN
                              '卖出'
                            WHEN 13 THEN
                              '活动送金'
                            WHEN 17 THEN
                              '天天刷'
                            ELSE
                              '天天领送金'
                            END AS bill_type,
                            product_type,
                            p_product_name,
                            CASE bill_type
                          WHEN 2 THEN
                            0
                          ELSE
                            ABS(b.weight)
                          END AS weight_in,
                          CASE bill_type
                        WHEN 2 THEN
                          ABS(b.weight)
                        ELSE
                          0
                        END AS weight_out,
                        b.current_gold_weight,
                        b.summary
                      FROM
                        s_bill b,
                        uic_user c
                      WHERE
                        b.uic_user_id = c.id
                      AND b.bill_type IN (2, 13, 17, 19) #卖出和送金的
                      AND c.id = :user_id
                    ) k `;
    let condition = '';
    let tail = 'ORDER BY createdAt ';
    if (query.is_export === 1) {
      if (query.id_string.split(',')[0].length !== 0) condition += 'where  FIND_IN_SET(id,:id_string) ';
    } else {
      tail += 'LIMIT :offset,:limit;';
    }
    const rows = await this.ctx.model.query(sql + condition + tail, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id_string: query.id_string,
        user_id: query.user_id,
        limit: query.pageSize,
        offset: query.pageSize * (query.pageIndex - 1)
      }
    });

    const sql2 = `SELECT
                    count(id) count
                  FROM
                    (
                      SELECT
                        b.id,
                        a.CODE AS order_no,
                        c.username,
                        c.nickname,
                        b.createdAt,
                        '买入' AS bill_type,
                        product_type,
                        p_product_name,
                        ABS(b.weight) AS weight_in,
                        0 AS weight_out,
                        b.current_gold_weight,
                        b.summary
                      FROM
                        s_order a,
                        s_bill b,
                        uic_user c
                      WHERE
                        a.id = b.s_order_id
                      AND b.uic_user_id = c.id
                      AND b.bill_type = 1 #买入
                      AND c.id = :user_id
                      UNION ALL
                        SELECT
                          b.id,
                          a.order_no,
                          c.username,
                          c.nickname,
                          b.createdAt,
                          '存金' AS bill_type,
                          product_type,
                          p_product_name,
                          ABS(b.weight) AS weight_in,
                          0 AS weight_out,
                          b.current_gold_weight,
                          b.summary
                        FROM
                          t_deposit_gold a,
                          s_bill b,
                          uic_user c
                        WHERE
                          a.id = b.s_order_id
                        AND b.uic_user_id = c.id
                        AND b.bill_type = 5 #存金
                        AND c.id = :user_id
                        UNION ALL
                          SELECT
                            b.id,
                            a.order_no,
                            c.username,
                            c.nickname,
                            b.createdAt,
                            '线上提金' AS bill_type,
                            product_type,
                            p_product_name,
                            0 AS weight_in,
                            ABS(b.weight) AS weight_out,
                            b.current_gold_weight,
                            b.summary
                          FROM
                            tijin_order_online a,
                            s_bill b,
                            uic_user c
                          WHERE
                            a.id = b.s_order_id
                          AND b.uic_user_id = c.id
                          AND b.bill_type = 6 #线上提金
                          AND c.id = :user_id
                          UNION ALL
                            SELECT
                              b.id,
                              a.order_no,
                              c.username,
                              c.nickname,
                              b.createdAt,
                              '线下提金' AS bill_type,
                              product_type,
                              p_product_name,
                              0 AS weight_in,
                              ABS(b.weight) AS weight_out,
                              b.current_gold_weight,
                              b.summary
                            FROM
                              tijin_order_offline a,
                              s_bill b,
                              uic_user c
                            WHERE
                              a.id = b.s_order_id
                            AND b.uic_user_id = c.id
                            AND b.bill_type = 12 #线下提金
                            AND c.id = :user_id
                            UNION ALL
                              SELECT
                                b.id,
                                a.order_no,
                                c.username,
                                c.nickname,
                                b.createdAt,
                                '饰品金提金' AS bill_type,
                                product_type,
                                p_product_name,
                                0 AS weight_in,
                                ABS(b.weight) AS weight_out,
                                b.current_gold_weight,
                                b.summary
                              FROM
                                decoration_order a,
                                s_bill b,
                                uic_user c
                              WHERE
                                a.id = b.s_order_id
                              AND b.uic_user_id = c.id
                              AND b.bill_type = 14 #饰品金提金
                              AND c.id = :user_id
                              UNION ALL
                                SELECT
                                  b.id,
                                  a.order_no,
                                  c.username,
                                  c.nickname,
                                  b.createdAt,
                                  CASE bill_type
                                WHEN 21 THEN
                                  'K收'
                                ELSE
                                  'K付'
                                END AS bill_type,
                                product_type,
                                p_product_name,
                                CASE bill_type
                              WHEN 21 THEN
                                ABS(b.weight)
                              ELSE
                                0
                              END AS weight_in,
                              CASE bill_type
                            WHEN 21 THEN
                              0
                            ELSE
                              ABS(b.weight)
                            END AS weight_out,
                            b.current_gold_weight,
                            b.summary
                          FROM
                            t_kpay a,
                            s_bill b,
                            uic_user c
                          WHERE
                            a.id = b.s_order_id
                          AND b.uic_user_id = c.id
                          AND b.bill_type IN (21, 22) #K收和K付
                          AND c.id = :user_id
                          UNION ALL
                            SELECT
                              b.id,
                              '' AS order_no,
                              c.username,
                              c.nickname,
                              b.createdAt,
                              CASE bill_type
                            WHEN 2 THEN
                              '卖出'
                            WHEN 13 THEN
                              '活动送金'
                            WHEN 17 THEN
                              '天天刷'
                            ELSE
                              '天天领送金'
                            END AS bill_type,
                            product_type,
                            p_product_name,
                            CASE bill_type
                          WHEN 2 THEN
                            0
                          ELSE
                            ABS(b.weight)
                          END AS weight_in,
                          CASE bill_type
                        WHEN 2 THEN
                          ABS(b.weight)
                        ELSE
                          0
                        END AS weight_out,
                        b.current_gold_weight,
                        b.summary
                      FROM
                        s_bill b,
                        uic_user c
                      WHERE
                        b.uic_user_id = c.id
                      AND b.bill_type IN (2, 13, 17, 19) #卖出和送金的
                      AND c.id = :user_id
                    ) k`;
    const count = await this.ctx.model.query(sql2, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id_string: query.id_string,
        user_id: query.user_id
      }
    });

    return {rows, count: count[0].count};
  }

  async rollRequest(model) {
    return await this.ctx.model.RollsRequest.create(model);
  }


  async rollCoupon(model) {
    const sql = `SELECT
                  max(coupon_id) AS max
                FROM
                  coupon_config`;
    const max_coupon_id = await this.ctx.model.query(sql, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
    });
    model.coupon_id = !max_coupon_id[0].max ? 100001 : max_coupon_id[0].max + 1;
    return await this.ctx.model.CouponConfig.create(model);
  }

  async templateList(query) {
    const sql = `SELECT id,
                       rolls_type,#赠券类型
                       rolls_name,#赠券名称
                       value_type,#类型
                       rolls_value,#面额
                       rolls_qty,#剩余张数
                       sill_amount,#使用门槛
                       valid_days,#有效天数
                       create_time#赠券创建日期
                FROM
                (
                SELECT a.id,
                       '2' AS rolls_type,
                       CONCAT(c.name,CASE WHEN a.days_limit<365 THEN '>=' ELSE '' END,FLOOR(a.days_limit/30),'个月') AS rolls_name,
                       '-' AS value_type,
                       a.sill_reward as rolls_value,
                       a.circulation-IFNULL(b.counts,0) AS  rolls_qty,
                       CASE a.sill_type  WHEN 1 THEN CONCAT('满',a.sill_amount,'元') WHEN 2 THEN CONCAT('满',a.sill_amount,'克') END AS sill_amount,
                       a.sill_limit AS valid_days,
                       a.create_time
                FROM coupon_config a
                LEFT JOIN 
                     (SELECT coupon_id,COUNT(id) as counts FROM product_rolls WHERE rolls_type='2' GROUP BY coupon_id) b
                     ON a.coupon_id=b.coupon_id
                JOIN  p_product c ON a.p_product_id=c.id
                WHERE  a.coupon_type=3
                AND    a.delete_time is NULL
                UNION ALL
                SELECT a.id,
                       '1' AS rolls_type,
                       CONCAT(c.name,FLOOR(a.rolls_days/30),'个月') AS rolls_name,
                       CASE a.value_type
                       WHEN '0' THEN '保值'
                       WHEN '1' THEN '保价' END value_type,
                       CONCAT(a.rolls_value,'%') AS rolls_value,
                       a.rolls_qty-IFNULL(b.counts,0) AS rolls_qty,
                       '-' AS sill_amount,
                       a.valid_days,
                       a.create_time
                FROM rolls_request a
                LEFT JOIN
                     (SELECT coupon_id,COUNT(id) as counts FROM product_rolls  WHERE rolls_type='1' GROUP BY coupon_id) b
                     ON a.id=b.coupon_id
                JOIN  p_product c ON a.p_product_id=c.id
                WHERE  a.rolls_source=2
                AND    a.delete_time is NULL
                ) k `;
    let condition = '';
    if (query.rolls_name) condition += 'WHERE rolls_name LIKE CONCAT(\'%\',:rolls_name,\'%\')';
    const tail = `ORDER BY create_time DESC
                  LIMIT :offset,:limit;`;
    const rows = await this.ctx.model.query(sql + condition + tail, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        rolls_name: query.rolls_name,
        limit: query.pageSize,
        offset: query.pageSize * (query.pageIndex - 1)
      }
    });

    const sql2 = `SELECT count(id) count
                  FROM
                  (
                  SELECT a.id,
                         '2' AS rolls_type,
                         CONCAT(c.name,CASE WHEN a.days_limit<365 THEN '>=' ELSE '' END,FLOOR(a.days_limit/30),'个月') AS rolls_name,
                         '-' AS value_type,
                         a.sill_reward as rolls_value,
                         a.circulation-IFNULL(b.counts,0) AS  rolls_qty,
                         CASE a.sill_type  WHEN 1 THEN CONCAT('满',a.sill_amount,'元') WHEN 2 THEN CONCAT('满',a.sill_amount,'克') END AS sill_amount,
                         a.sill_limit AS valid_days,
                         a.create_time
                  FROM coupon_config a
                  LEFT JOIN 
                       (SELECT coupon_id,COUNT(id) as counts FROM product_rolls WHERE rolls_type='2' GROUP BY coupon_id) b
                       ON a.coupon_id=b.coupon_id
                  JOIN  p_product c ON a.p_product_id=c.id
                  WHERE  a.coupon_type=3
                  AND    a.delete_time is NULL
                  UNION ALL
                  SELECT a.id,
                         '1' AS rolls_type,
                         CONCAT(c.name,FLOOR(a.rolls_days/30),'个月') AS rolls_name,
                         CASE a.value_type
                         WHEN '0' THEN '保值'
                         WHEN '1' THEN '保价' END value_type,
                         CONCAT(a.rolls_value,'%') AS rolls_value,
                         a.rolls_qty-IFNULL(b.counts,0) AS rolls_qty,
                         '-' AS sill_amount,
                         a.valid_days,
                         a.create_time
                  FROM rolls_request a
                  LEFT JOIN
                       (SELECT coupon_id,COUNT(id) as counts FROM product_rolls  WHERE rolls_type='1' GROUP BY coupon_id) b
                       ON a.id=b.coupon_id
                  JOIN  p_product c ON a.p_product_id=c.id
                  WHERE  a.rolls_source=2
                  AND    a.delete_time is NULL
                  ) k `;
    const count = await this.ctx.model.query(sql2 + condition, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        rolls_name: query.rolls_name,
      }
    });

    return {rows, count: count[0].count};
  }

  async giveRoll(body) {
    const new_roll_array = [];
    const count = await this.ctx.model.ProductRolls.count({where: {coupon_id: body.id}});
    if (body.rolls_type === '1') {
      const r = await this.ctx.model.RollsRequest.findById(body.id);
      if (!r) this.ctx.throw(401, '找不到资源！');
      const product = await this.ctx.model.PProduct.findById(r.p_product_id);
      if (!product) this.ctx.throw(401, '找不到资源！');
      // 检查剩余张数是否够用
      if (r.rolls_qty - count < body.user_id_array.length) this.ctx.throw(200, '剩余张数不够了！');
      const month = Math.floor(r.rolls_days / 30);
      for (let i = 0; i < body.user_id_array.length; i++) {
        new_roll_array.push({
          rolls_value: r.rolls_value,
          rolls_type: '1',
          user_id: body.user_id_array[i],
          value_type: r.value_type,
          rolls_name: '加息券',
          p_product_id: r.p_product_id,
          p_product_name: product.name + month + '个月',
          is_use: '0',
          start_date: Date.now(),
          end_date: moment().add(r.rolls_days, 'days'),
          coupon_id: r.id,
          give_state: 1,
        });
      }
    } else {
      const c = await this.ctx.model.CouponConfig.findById(body.id);
      if (!c) this.ctx.throw(401, '找不到资源！');
      const product = await this.ctx.model.PProduct.findById(c.p_product_id);
      if (!product) this.ctx.throw(401, '找不到资源！');
      // 检查剩余张数是否够用
      if (c.circulation - count < body.user_id_array.length) this.ctx.throw(200, '剩余张数不够了！');
      const month = Math.floor(c.days_limit / 30);
      for (let i = 0; i < body.user_id_array.length; i++) {
        new_roll_array.push({
          rolls_value: c.sill_reward,
          rolls_type: '2',
          user_id: body.user_id_array[i],
          // value_type: c.value_type,
          rolls_name: '现金红包',
          p_product_id: c.p_product_id,
          p_product_name: product.name + '>=' + month + '个月',
          is_use: '0',
          start_date: Date.now(),
          end_date: moment().add(c.sill_limit, 'days'),
          coupon_id: c.coupon_id,
          give_state: 1,
        });
      }
    }
    return await this.ctx.model.ProductRolls.bulkCreate(new_roll_array);
  }

  async productNameList() {
    return await this.ctx.model.PProduct.findAll({
      where: {
        status: 4
      },
      attributes: ['id', 'name', 'type_name'],
      raw: true,
      order: [
        ['createdAt', 'DESC']
      ]
    });
  }

}

module.exports = Operate;