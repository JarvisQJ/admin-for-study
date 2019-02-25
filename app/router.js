'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/homepage')(app);
  require('./router/market')(app);
  require('./router/operation')(app);
  require('./router/finance')(app);
  require('./router/system')(app);
  require('./router/personal')(app);
};
