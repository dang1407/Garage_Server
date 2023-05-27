const User = require('../../models/user.model')

class SiteCotroller {
      index(req, res) {
            User.find({})
            .then ((users) => {
                  users = users.map((user) => user.toObject());
                  res.json(users);
            })
      }
}

module.exports = new SiteCotroller();