const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");
class Account {
  async login(req, res) {
    const userLogin = {
      email: req.body.email,
    };
    const user = await User.findOne(userLogin);
    // console.log(user);
    const checkUser = await bcrypt.compare(req.body.password, user.password);
    if (user && checkUser) {
      res.json({ status: "OK", user: true });
    } else {
      res.json({ status: "error" });
    }
  }

  async updateAcc(req, res) {
    const email = req.body.email;
    console.log(email);
    let user = await User.findOne({ email: req.body.email });
    // console.log(user);
    if (!user) {
      res.json({ status: "Error", error: "User isn't exist!" });
      return;
    }
    const checkUser = await bcrypt.compare(req.body.password, user.password)
    if (checkUser) {
      res.json({ status: "Error", error: "Bạn đã nhập mật khẩu cũ" });
      return;
    } else {
      const newPassword = await bcrypt.hash(req.body.password, 10);
      let user = await User.findOneAndUpdate(
        { email: req.body.email },
        { password: newPassword }
      );
      console.log(user);
      res.json({ status: "OK" });
    }
  }

  async deleteAcc(res, req) {
    const email = req.params.email;
    // console.log(req.body.email);
    let user = await User.findOne({ email: req.params.email });
    console.log("User = " + user);
    if (user) {
      user = await User.findOneAndRemove({ email: req.params.email });
      res.json({ status: "OK" });
    } else {
      res.json({ status: "Error", error: "User isn't exist!" });
    }
  }

  async registerAcc(req, res) {
    console.log(req.body);
    try {
      let user = await User.findOne({ email: req.body.email });
      console.log("User = " + user);
      if (!user) {
        const newPassword = await bcrypt.hash(req.body.password, 10);
        user = await User.create({
          name: req.body.name,
          password: newPassword,
          email: req.body.email,
        });
        res.json({ status: "OK" });
      } else {
        res.json({ status: "Error", message: "Email already exists!" });
      }
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: "Duplicate email" });
    }
  }
}

module.exports = new Account();
