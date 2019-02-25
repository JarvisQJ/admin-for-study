const config = require('./config/config.default')({});
const path = require('path');
const EggSequelizeAuto = require('egg-sequelize-auto')

const modelsDir = path.join(__dirname, './app/model');
const {
  host,
  username,
  password,
  database,
  port,
  dialect,
} = config.sequelize;


const auto = new EggSequelizeAuto(database, username, password, {
  host,
  port,
  dialect,
  directory: modelsDir,
  // 指定生成的 model 文件的缩进格式以匹配 ESlint 规则
  spaces: true, // 使用空格缩进
  indentation: 2, // 使用 2 空格缩进
  additional: {
    freezeTableName: true, // 设置为true时，sequelize不会改变表名，否则可能会按其规则有所调整
    omitNull: false, // 是否忽略空值，这意味着，所有列的空值将不会被保存
    timestamps: false, // 为模型添加 createdAt 和 updatedAt 两个时间戳字段
    paranoid: false, // 使用逻辑删除。设置为true后，调用 destroy 方法时将不会删掉模型，而是设置一个 deletedAt 列。此设置需要 timestamps=true
    // createdAt: 'create_time', // 如果为字符串，则使用提供的值代替 createdAt 列的默认名，设置为flase则不添加这个字段
    // updatedAt: 'update_time', // 如果为字符串，则使用提供的值代替 updatedAt 列的默认名，设置为flase则不添加这个字段
    // deletedAt: 'delete_time', // 如果为字符串，则使用提供的值代替 deletedAt 列的默认名，设置为flase则不添加这个字段
    createdAt: 'createdAt', // 如果为字符串，则使用提供的值代替 createdAt 列的默认名，设置为flase则不添加这个字段
    updatedAt: 'updatedAt', // 如果为字符串，则使用提供的值代替 updatedAt 列的默认名，设置为flase则不添加这个字段
    // deletedAt: 'deletedAt', // 如果为字符串，则使用提供的值代替 deletedAt 列的默认名，设置为flase则不添加这个字段
  },
  tables: ['tijin_order_offline'],
});

console.log('> syncing model...');
auto.run(function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log(auto.tables); // table list
    console.log('> done.');
  }
});