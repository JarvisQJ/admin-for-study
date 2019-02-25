'use strict';

const Service = require('egg').Service;

class Address extends Service {
  async findAddressByUserId(id) {
    return await this.ctx.model.UserAddress.findAll({
      raw: true,
      where: {
        user_id: id
      }
    });
  }


}

module.exports = Address;