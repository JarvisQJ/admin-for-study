/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('user_authentication', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    requestno: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ''
    },
    yborderid: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ''
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    identity_card: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    identity_card_front_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    identity_card_back_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    identity_card_address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bank_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ''
    },
    bank_account: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ''
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ''
    },
    bank_deposit: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    state: {
      type: DataTypes.ENUM('3','2','1','0'),
      allowNull: false,
      defaultValue: '0'
    },
    auditor_user_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    auditor_nickname: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    tableName: 'user_authentication',
    freezeTableName: true,
    omitNull: false,
    timestamps: true,
    paranoid: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: 'delete_time'
  });

  Model.associate = function() {

  }

  return Model;
};
