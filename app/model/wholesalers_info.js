/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('wholesalers_info', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ws_user_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ws_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ws_telephone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ws_address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    img_url_big: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    img_url_small: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bill_rule: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bill_service: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    year_interest: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    ws_type: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
  }, {
    tableName: 'wholesalers_info',
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
