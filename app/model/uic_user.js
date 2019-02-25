/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('uic_user', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    top_parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    bind_shop_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    yibao_userid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ''
    },
    accountId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sealData: {
      type: DataTypes.STRING(10000),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    nickname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    pass: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    salt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    confirmed: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    confirmcode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    failed_login_count: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    usertype: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    pass_pay: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    salt_pay: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    source: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    user_nature: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
    },
    become_partner_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_bonus_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    total_can_shua_num: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    package_pool: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.000'
    },
    draw_num: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0'
    },
    register_province: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    register_city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    app_menu: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    enabled: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
  }, {
    tableName: 'uic_user',
    freezeTableName: true,
    omitNull: false,
    timestamps: true,
    paranoid: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  });

  Model.associate = function() {

  }

  return Model;
};
