const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// const Excel = require('exceljs');


/**
 * 将直接从数据库查出的每个节点只存父节点ID的数据，转为更直观的json树形数据。
 * 1.all中必须包含根节点，形似[{},{},{}]
 * 2.all中每个元素至少有id和parent_id两个字段
 * @param all 需要转化的节点原始数据
 * @return 树形结构json
 */
exports.convertTree = all => {
  const tmp = {};
  for (let i = 0; i < all.length; i++) {
    const item = all[i];
    if (!tmp[item.id]) {
      tmp[item.id] = {};
    }
    // 根据引用类型数据特性，所有tmp的节点，key键为tmp[item.id]的数据都是指向同一堆地址，修改一个{tmp[item.id]:xxx}，其他的也会一起变。
    for (const key in item) {
      if (item.hasOwnProperty(key)) tmp[item.id][key] = item[key];
    }
    if (!('children' in tmp[item.id])) tmp[item.id].children = [];
    if (tmp[item.father_id]) {
      tmp[item.father_id].children.push(tmp[item.id]);
    } else {
      tmp[item.father_id] = {children: [tmp[item.id]]};
    }
  }
  return tmp[0].children;
};

exports.setPassword = (user, password) => {
  user.salt = crypto.randomBytes(16).toString('hex');
  user.pass = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha1').toString('hex');
  return {salt: user.salt, pass: user.pass};
};

exports.validPassword = (user, password) => {
  const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha1').toString('hex');
  return user.pass === hash;
};

exports.generateJWT = (user, login, app) => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + app.config.jwt.exp || 30); //天
  return jwt.sign({
    id: user.id,
    loginid: login.id,
    nickname: user.nickname,
    username: user.username,
    usertype: user.usertype,
    roleid: user.role_id,
    yibao_userid: user.yibao_userid,
    certificate_status: user.certificate_status,
    exp: parseInt(expiry.getTime() / 1000)
  }, app.config.jwt.salt);
};

// exports.buildExcel = (data, columns, ctx) => {
//   const workbook = new Excel.Workbook();
//   const worksheet = workbook.addWorksheet();
//   worksheet.columns = columns;
//   worksheet.addRows(data);
//   ctx.response.attachment('report.xlsx');
//   // 这里workbook.xlsx.writeBuffer()返回promise对象，所以外部调用需要await
//   // workbook.xlsx.writeFile('xxxx.xlsx')
//   //   .then(function() {
//   //     // done
//   //   });
//   ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//   return workbook.xlsx.write(ctx.res);
// };

