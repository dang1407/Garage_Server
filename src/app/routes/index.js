const site = require('./site');
const account = require('./account');
const park = require('./parkingfee')
const {notFound, errHandler} = require('../../middlewares/errHandler');
function route(app){
      app.use('/api', account);
      app.use('/park', park)
      // app.use('/', site);

      // Không tìm thấy thì báo lỗi
      app.use(notFound);
      app.use(errHandler);
}

module.exports = route;