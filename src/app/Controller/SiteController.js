const User = require('../../models/user.model')

class SiteCotroller {
      // index(req, res) {
      //       User.find({})
      //       .then ((users) => {
      //             users = users.map((user) => user.toObject());
      //             res.json(users);
      //       })
      // }

      index(req, res) {
            return res.status(200).json("Hello World")
      }
}

module.exports = new SiteCotroller();