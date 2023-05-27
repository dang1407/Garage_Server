const User = require("../../models/user.model");

class UpdateAcc {
      async index(req, res){
            const email = req.body.email;
            console.log(email);
            let user = await User.findOne({email: req.body.email});
            // console.log(user);
            if(!user){
                  res.json({status: "Error", error:"User isn't exist!"})
                  return;
            }
            if(user.password === req.body.password){
                  res.json({status: "Error", error: "Bạn đã nhập mật khẩu cũ"});
                  return;
            }
            else{
                  let user = await User.findOneAndUpdate({email: req.body.email}, {password: req.body.password});
                  console.log(user);
                  res.json({status: "OK"});
            } 
      }

      hello(req, res){
            res.json("Hello from update user!")
      }
}

module.exports = new UpdateAcc();