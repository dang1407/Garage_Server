const User = require('../../models/user.model')

class RegisterController {
      // [POST]
      async postUserAcc(req, res){
            console.log(req.body);
            try {
                  let user = await User.findOne({email: req.body.email});
                  console.log("User = " + user);
                  if(!user){
                        user = await User.create({
                              name: req.body.name,
                              password: req.body.password,
                              email: req.body.email
                        });
                        res.json({status: "OK"});
                  } else {
                        res.json({status: "Error", message: "Email already exists!"})
                  }
                  
            } catch (error) {
                  console.log(error)
                  res.json({status: "error", error: "Duplicate email"})
            }
      }

      index(req, res) {
            res.json("Hello from Register Controller");
      }
}

module.exports = new RegisterController();