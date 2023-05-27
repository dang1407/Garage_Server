const User = require('../../models/user.model');

class DeleteAcc {
      async index(req, res) {
            const email = req.params.email;
            // console.log(req.body.email);
            let user = await User.findOne({email: req.params.email});
            console.log("User = " + user);
            if(user){
                  user = await User.findOneAndRemove({email: req.params.email});
                  res.json({status: "OK"});
            } else {
                  res.json({status: "Error", error: "User isn't exist!"});
            }
      }

      hello(req, res){
            res.json("Hello from delete user!")
      }
}

module.exports = new DeleteAcc();