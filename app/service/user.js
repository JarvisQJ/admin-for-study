'use strict';

const Service = require('egg').Service;

class User extends Service {

  async login(query) {
    return await this.ctx.model.UicUser.findOne({
      where: {
        username: query.username,
        usertype: query.usertype,
        enabled: 1,
        deletedAt: null
      }
    });
  }

  async findByUsername(username) {
    return await this.ctx.model.query('select * from uic_user where username=:username', {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        username
      }
    });
  }

  async saveLoginInfo(user, why) {
    const tran = await this.ctx.model.transaction();
    try {
      // 灭活上次登录信息
      await this.ctx.model.UicLogin.update({active: false, ended: new Date()}, {
        where: {
          user: user.id,
        },
        transaction: tran
      });

      // 创建登录信息实例
      const login = this.ctx.model.UicLogin.build({
        user: user.id,
        usertype: user.usertype,
        username: user.username,
        when: new Date(),
        why,
        active: true,
      });
      // 生成token
      login.token = this.ctx.helper.generateJWT(user, login, this.ctx.app);
      // 保存实例
      await login.save({transaction: tran});

      await tran.commit();
      return login;

    } catch (e) {
      await tran.rollback();
      this.ctx.logger.error(e);
      return null;
    }

  }

  async listAdmin(query) {
    // const condition = {usertype: 1};
    // if (query.username) condition.username = {$like: `%${query.username}%`};
    // if (query.role_name) condition.username = {$like: `%${query.role_name}%`};
    // return await this.ctx.model.TTest.findAndCountAll({
    //   // where: condition,
    //   // order: [
    //   //   ['createdAt', 'DESC']
    //   // ],
    //   include: [
    //     {model: this.ctx.model.UicUser}
    //   ],
    //   limit: query.pageSize,
    //   offset: query.pageSize * (query.pageIndex - 1)
    // });

    const sql = `SELECT
                    u.id,
                    u.username,
                    u.nickname,
                    r.\`name\` role_name,
                    u.createdAt,
                    v.last_login,
                    u.enabled,
                    r.id role_id
                  FROM
                    uic_user u
                  LEFT JOIN manage_role r ON u.role_id = r.id
                  LEFT JOIN (
                    SELECT
                      USER,
                      max(createdAt) last_login
                    FROM
                      uic_login
                    GROUP BY
                      USER
                  ) v ON v. USER = u.id
                  WHERE
                    u.usertype = 1
                  AND u.deletedAt IS NULL
                  AND (
                    u.username LIKE :username
                    OR u.nickname LIKE :username
                  )
                  AND r. NAME LIKE :role_name
                  ORDER BY
                   :order
                  LIMIT :offset,
                   :pageSize`;
    const rows = await this.ctx.model.query(sql, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        offset: query.pageSize * (query.pageIndex - 1),
        pageSize: query.pageSize,
        username: `%${query.username}%`,
        role_name: `%${query.role_name}%`,
        order: `u.createdAt %${query.order}%`
      }
    });

    const sql2 = `SELECT
                    count(u.id) count
                  FROM
                    uic_user u
                  LEFT JOIN manage_role r ON u.role_id = r.id
                  LEFT JOIN (
                    SELECT
                      USER,
                      max(createdAt) last_login
                    FROM
                      uic_login
                    GROUP BY
                      USER
                  ) v ON v. USER = u.id
                  WHERE
                    u.usertype = 1
                  AND u.deletedAt IS NULL
                  AND (
                    u.username LIKE :username
                    OR u.nickname LIKE :username
                  )
                  AND r. NAME LIKE :role_name`;
    const count = await this.ctx.model.query(sql2, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        username: `%${query.username}%`,
        role_name: `%${query.role_name}%`,
      }
    });
    return {
      rows,
      count: count[0].count
    };

  }

  async addAdmin(model) {
    return await this.ctx.model.UicUser.create(model);
  }

  async modifyUser(id, model) {
    return await this.ctx.model.UicUser.update(model, {where: {id}});
  }

  async inviteList(query) {
    const sql = `SELECT
                    id,
                    username,
                    nickname,
                    COUNT(son_id) success_invite,
                    COUNT(is_exist = 1 OR NULL) success_deal
                  FROM
                    (
                      SELECT
                        u1.id,
                        u1.username,
                        u1.nickname,
                        u2.id son_id,
                        EXISTS (
                          SELECT
                            1
                          FROM
                            s_order
                          WHERE
                            u2.id = uic_user_id
                          AND \`status\` = 2
                        ) is_exist
                      FROM
                        uic_user u1
                      LEFT JOIN uic_user u2 ON u1.id = u2.parent_id
                      WHERE u1.usertype = 2
                    ) a
                  WHERE
                    1 = 1 `;
    let condition = '';
    if (query.username) condition += 'AND username LIKE CONCAT(\'%\',:username,\'%\') ';
    if (query.nickname) condition += 'AND nickname LIKE CONCAT(\'%\',:nickname,\'%\') ';
    let tail = `GROUP BY id 
                ORDER BY ${query.orderBy} ${query.order} `;
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
        username: query.username,
        nickname: query.nickname,
        limit: query.pageSize,
        offset: query.pageSize * (query.pageIndex - 1)
      }
    });

    const sql2 = `SELECT
                      count(id) count
                    FROM
                      (
                        SELECT
                          u1.id,
                          u1.username,
                          u1.nickname,
                          u2.id son_id,
                          EXISTS (
                            SELECT
                              1
                            FROM
                              s_order
                            WHERE
                              u2.id = uic_user_id
                            AND \`status\` = 2
                          ) is_exist
                        FROM
                          uic_user u1
                        LEFT JOIN uic_user u2 ON u1.id = u2.parent_id
                        WHERE u1.usertype = 2
                      ) a
                    WHERE
                      1 = 1 `;
    const count = await this.ctx.model.query(sql2 + condition, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        id_string: query.id_string,
        username: query.username,
        nickname: query.nickname,
      }
    });

    return {rows, count: count[0].count};
  }

}

module.exports = User;