const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcryptjs');
const cryto = require('crypto')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    gender: {
      type: String, 
      required: true
    },
    birthDay: {
      type: String, 
      required: true
    },
    mobile:{
        type:String,
        required:true,
        unique: true
    },
    address: {
      type: String, 
      default: "Chưa có thông tin"
    },
    work: {
      type: String,
      required: true
    },
    avatar: {
      type: String, 
      default: "https://res.cloudinary.com/dmbzrlrot/image/upload/v1689500262/Garage/Thi%E1%BA%BFt_k%E1%BA%BF_ch%C6%B0a_c%C3%B3_t%C3%AAn_pa9ekw.png"
    },
    avatarKey: {
      type: String,
    },
    workPart: {
      type: String,
      required: true
    },
    vehicle: {
      type: String,
      default: "Chưa đăng ký"
    },
    licensePlates: {
      type: String,
      // required: true,
      default: "Chưa đăng ký"
    },
    employeeCode: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      default: "user"
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    refreshToken: {
      type: String,
    },
    passwordChangeAt: {
      type: String
    }, 
    passwordResetToken: {
      type: String
    },
    passwordResetTokenExpires: {
      type: String
    },
//     address: [{type: mongoose.Types.ObjectId, ref: "Address"}]
}, {
      timestamps: true,
      collection: 'users'
});



// Có thể băm mật khẩu trước khi lưu như thế này, thay vì làm trong hàm login
userSchema.pre('save', async function(next){
      // Nếu mật khẩu không đổi thì chuyển hàm
      // if(!this.isModified('password')){
      //       next()
      // }
      // Mã hóa 10 lần, thông thường với mức 10 lần là đủ
      const salt = bcrypt.genSaltSync(10);
      this.password = await bcrypt.hash(this.password, salt);
})


userSchema.methods = {
  isCorrectPassword: async function(password){
    return bcrypt.compare(this.password, password);
  },
  createPasswordChangeToken: async function(){
    const resetToken = cryto.randomBytes(32).toString('hex');
    this.passwordResetToken = cryto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 15*60*1000;
    return resetToken;
  }
}

//Export the model
module.exports = mongoose.model('User', userSchema);