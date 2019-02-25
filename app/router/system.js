'use strict';

//首页

module.exports = app => {
  const router = app.router.namespace('/new/system');
  const {controller} = app;

  router.get('/menu/all/:role_id', controller.menu.allMenu);
  router.get('/menu/list', controller.menu.listMenu);
  router.post('/menu', controller.menu.createMenu);
  router.get('/menu/:id', controller.menu.getMenu);
  router.put('/menu/set/unusable/:id', controller.menu.setUnusable);
  router.put('/menu/set/usable/:id', controller.menu.setUsable);
  router.put('/menu/:id', controller.menu.modifyMenu);
  router.delete('/menu/:id', controller.menu.deleteMenu);

  router.get('/role/list', controller.role.listRole);
  router.get('/role/menu/list/:role_id', controller.role.roleMenuList);
  router.post('/role', controller.role.createRole);
  router.post('/role/set/menu', controller.role.setRoleMenu);
  router.get('/role/:id', controller.role.getRole);
  router.put('/role/:id', controller.role.modifyRole);
  router.delete('/role/:id', controller.role.deleteRole);
  router.get('/role/name/list', controller.role.nameList);

  router.get('/operate/list', controller.operate.listOperate);

  router.post('/user', controller.user.addAdmin);
  router.get('/user/admin/list', controller.user.listAdmin);
  router.put('/user/set/role/:id', controller.user.setRole);
  router.put('/user/enable/:id', controller.user.enableAdmin);
  router.delete('/user/:id', controller.user.deleteAdmin);

  // 买卖黄金金价调节设置
  router.put('/gold/price/set', controller.setting.priceSet);
  router.get('/gold/price/set/list', controller.setting.priceSetList);

};
