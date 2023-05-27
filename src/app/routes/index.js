const login = require('./login');
const register = require('./register');
const site = require('./site');
const updateAcc = require('./updateAcc');
const deleteAcc = require('./deleteacc');
function route(app){
      app.use('/register', register);
      app.use('/login', login);
      app.use('/updateacc', updateAcc);
      app.use('/deleteacc', deleteAcc);
      app.use('/', site);
}

module.exports = route;