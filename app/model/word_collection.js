/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('word_collection', {
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
    collect_type: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    word_name: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    is_share: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    is_receive: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    friend_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    is_convert: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    word_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    s_bill_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
  }, {
    tableName: 'word_collection',
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
