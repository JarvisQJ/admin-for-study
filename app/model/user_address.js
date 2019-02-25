/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('user_address', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    contacts: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    post_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    area: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    street: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    is_default: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'user_address',
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
