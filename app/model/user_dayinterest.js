/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('user_dayinterest', {
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
    product_type_code: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_type_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    year_interest: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    weight: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    money: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    interest_day: {
      type: DataTypes.DATE,
      allowNull: true
    },
    interest_money: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    summary: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    rolls_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'user_dayinterest',
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
