/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('yibao_charge', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    requestno: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    yborderid: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('1','2','3','4','5','6','7'),
      allowNull: true,
      defaultValue: '1'
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ybtypeid: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    s_order_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    st_order_id: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    errorcode: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    errormsg: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
  }, {
    tableName: 'yibao_charge',
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
