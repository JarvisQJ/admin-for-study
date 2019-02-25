/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('user_shop_relation', {
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
    shop_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
  }, {
    tableName: 'user_shop_relation',
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
