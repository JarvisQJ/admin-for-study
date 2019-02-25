/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('user_integral', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    s_order_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('1','2','3','4','0'),
      allowNull: false,
      defaultValue: '0'
    },
    gold_weight: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.000'
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    integral_num: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0'
    },
    summary: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ''
    },
    edit_user: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
  }, {
    tableName: 'user_integral',
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
