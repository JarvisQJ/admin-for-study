'use strict';

const Service = require('egg').Service;

class Role extends Service {
  async listRole(query) {

    const sql = `SELECT
                    *
                  FROM
                    manage_role r
                  LEFT JOIN (
                    SELECT
                      role_id,
                      COUNT(id) count
                    FROM
                      uic_user
                    GROUP BY
                      role_id
                  ) a ON
                    r.id = a.role_id
                  WHERE
                    r.deletedAt IS NULL
                  ORDER BY
                   ${query.orderBy === 'count' ? 'a' : 'r'}.${query.orderBy} ${query.order}
                  LIMIT :offset,
                   :pageSize`;
    const rows = await this.ctx.model.query(sql, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        offset: query.pageSize * (query.pageIndex - 1),
        pageSize: query.pageSize,
      }
    });

    const sql2 = `SELECT
                    count(r.id) count
                  FROM
                    manage_role r
                  LEFT JOIN (
                    SELECT
                      role_id,
                      COUNT(id) count
                    FROM
                      uic_user
                    GROUP BY
                      role_id
                  ) a ON
                    r.id = a.role_id`;
    const count = await this.ctx.model.query(sql2, {
      type: this.ctx.model.QueryTypes.SELECT
    });

    return {rows, count: count[0].count};

  }

  async createRole(model) {
    return await this.ctx.model.ManageRole.create(model);
  }

  async getRole(id) {
    return await this.ctx.model.ManageRole.findById(id);
  }

  async modifyRole(id, model) {
    return await this.ctx.model.ManageRole.update(model, {where: {id}});
  }

  async nameList() {
    return await this.ctx.model.ManageRole.findAll({
      where: {
        deletedAt: null,
        state: 1
      },
      attributes: ['id', 'name'],
    });
  }

  async setRoleMenu(model) {
    // 新增
    if (model.type === '1') {
      const instance = await this.ctx.model.ManageRolemenu.findOne({
        where: {
          role_id: model.role_id,
          menu_id: model.menu_id
        }
      });
      if (instance) this.ctx.throw(406, '该角色已经拥有该权限了！');
      //判断菜单是否已删除
      const instance2 = await this.ctx.model.ManageMenu.findOne({
        where: {
          deletedAt: null,
          state: 1,
          id: model.menu_id
        }
      });
      if (!instance2) this.ctx.throw(406, '该角色已停用或删除！');
      return await this.ctx.model.ManageRolemenu.create({role_id: model.role_id, menu_id: model.menu_id});
    }
    // 删除
    return await this.ctx.model.ManageRolemenu.update({deletedAt: Date.now()}, {
      where: {
        role_id: model.role_id,
        menu_id: model.menu_id
      }
    });
  }

  async roleMenuList(role_id) {
    const menuIds = await this.ctx.model.ManageRolemenu.findAll({
      raw: true,
      attributes: ['menu_id'],
      where: {
        role_id
      }
    }).map(function (item) {
      return item.menu_id;
    });

    const idStr = menuIds.join(',');
    // console.log('idStr:', idStr);

    const sql = `SELECT
                    *
                  FROM
                    (
                      SELECT
                        *,
                      IF (
                        FIND_IN_SET(id, :idStr) > 0,
                        1,
                        0
                      ) isOwn
                      FROM
                        manage_menu
                    ) a
                  WHERE
                  deletedAt IS NULL
                  AND (isOwn = 1 OR state = 1)`;
    return await this.ctx.model.query(sql, {
      type: this.ctx.model.QueryTypes.SELECT,
      raw: true,
      replacements: {
        idStr
      }
    });

  }

}

module.exports = Role;