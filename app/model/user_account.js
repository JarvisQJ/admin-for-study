/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('user_account', {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    balance: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    withdrawing_cash: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    goldWeight: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.000'
    },
    goldMoney: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    otherMoney: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    yesterday_income: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    total_income: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    goldLTWeight: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.000'
    },
    goldCBWeight: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.000'
    },
    goldWLWeight: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.000'
    },
    goldWLExpire: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.000'
    },
    credit_gold_weight: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.000'
    },
    averagePriceLT: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    averagePriceCP: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    averagePriceWL: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    floatProfitLossLT: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    floatProfitLossCP: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    remind_tequan: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '1'
    },
    integral_value: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    accountName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    accountNo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    total_bonus: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.00'
    },
    tequan_value: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: '0'
    },
    dingpan_buy_money: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.00'
    },
    dingpan_sellout_weight: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.000'
    },
    tijin_online_weight: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.000'
    },
    tijin_online_fee: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.00'
    },
    decoration_weight: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.000'
    },
  }, {
    tableName: 'user_account',
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
