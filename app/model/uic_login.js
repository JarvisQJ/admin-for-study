/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('uic_login', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    usertype: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    when: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ended: {
      type: DataTypes.DATE,
      allowNull: true
    },
    why: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    user: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    token: {
      type: DataTypes.STRING(2000),
      allowNull: true
    },
    clientid: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    devicetoken: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    seneca: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    login_province: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    login_city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
  }, {
    tableName: 'uic_login',
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
