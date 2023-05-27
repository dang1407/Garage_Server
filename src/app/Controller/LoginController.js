const User = require("../../models/user.model");

class LoginController {
  // [POST]
  async pCheckUserAcc(req, res) {
    const userLogin = {
      email: req.body.email,
      password: req.body.password
    }
    const user = await User.findOne(userLogin)
    // console.log(user);
    if(user){
      res.json({ status: "OK", user: true });
    } else {
      res.json({status: "error"})
    }
  }
}

module.exports = new LoginController();
