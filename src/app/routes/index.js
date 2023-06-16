const site = require('./site');
const account = require('./account');
function route(app){
      app.use('/api', account);
      app.use('/', site);
}

module.exports = route;