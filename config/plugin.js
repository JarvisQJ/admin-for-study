'use strict';

// had enabled by egg
// exports.static = true;
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.routerPlus = {
  enable: true,
  package: 'egg-router-plus',
};

exports.validate = {
  enable: true,
  package: 'egg-validate',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};