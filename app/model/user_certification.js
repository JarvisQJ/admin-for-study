/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('user_certification', {
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
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
    },
    photo_url: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
  }, {
    tableName: 'user_certification',
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
