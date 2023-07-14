const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../../middlewares/jwt');
const { response } = require("express");
const jwt = require('jsonwebtoken')
const sendEmail = require('../../utils/sendMail')
const crypto = require('crypto');
const localStorage = require('localStorage')


// sử dụng express-async-handler để bắt lỗi và ném lỗi ra cho thằng routes
// Refresh Token => cấp mới Access Token
// Access Token => xác thực người dùng, phân quyền người dùng
  const login = asyncHandler( async(req, res) => {
    const {email, password} = req.body;
    if( !email || !password ){
      return res.json({
        success: false,
        message: "Missing inputs!"
      })
    }
    const userLogin = {
      email: req.body.email,
    };
    const user = await User.findOne(userLogin);
    // console.log(user);
    if (user) {
      const checkUser = await bcrypt.compare(req.body.password, user.password);
      if(checkUser){
        // Tạo JWT
        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);
        // Lưu refreshToken vào cookies
        res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 7*24*60*60*1000})
        // localStorage.setItem('accessToken', accessToken)
        // Từ khóa new: true giúp trả về dữ liệu sau khi lưu thay vì trước khi lưu
        await User.findByIdAndUpdate(user._id, {refreshToken}, {new: true});
        res.json({ status: "OK", user: true, accessToken, role: user.role });
      }
      else {
        res.json({ status: "error", mes: "Wrong password!" });
      }
    } else {
      res.json({ status: "error", mes: "Email hasn't been register!" });
    }
  })


  const logined = asyncHandler(async (req, res) => {
    const {id, role} = req.user;
    return  res.status(200).json({
        success: role ? true : false,
        role: role ? role : null
      })
  })

  const updateAcc = asyncHandler(async(req, res) =>{
    const {_id} = req.user;
    if(!_id || Object.keys(req.body).length === 0) throw new Error("Missing inputs!")
    const user = User.findByIdAndUpdate({_id}, req.body, {new: true});
    return res.status(200).json({
      success: user ? true : false,
      updatedUser: user ? user : "Something went wrong!" 
    })
  })

  const adminUpdateAccEmp = asyncHandler(async(req, res) =>{
    const {email} = req.body;
    if(!email) throw new Error("Missing input!")
    const user = await User.findOneAndUpdate({email}, req.body, {new: true});
    if(!user) throw new Error("User isnot exist!")
    return res.status(200).json({
      success: true,
    })
  })
  const deleteAcc = asyncHandler(async(req, res) => {
    const {_idAdmin, role} = req.user;
    const userId = req.params.id;
    console.log(userId)
    if(!role || !userId) throw new Error("Missing inputs!");
    const user = await User.findByIdAndDelete(userId);
    if(!user) throw new Error("User isn't exist!");
    return res.status(200).json({
      success: true,
      message: "User is deleted!"
    })
  })

  const registerAcc = asyncHandler( async(req, res) => {
    console.log(req.body);
    const {name, email, password, mobile, work, workPart, licensePlates, vehicle, employeeCode } = req.body;
    if(!name || !email || !password || !mobile || !workPart || !employeeCode || !work){
      return res.json({
        success: false,
        message: "Missing inputs!"
      })
    }
    if(vehicle === ""){
      req.body.vehicle = "Chưa đăng ký"
    }

    if(licensePlates === ""){
      req.body.licensePlates = "Chưa đăng ký"
    }
    const userExist = await User.findOne({email})
    // Phải có await để chờ đến khi kết quả thực hiện xong
    if(!userExist){
      // Chuyển object mongodb sang plain object
      const respone = await User.create(req.body)
      const {password, role, ...userData } = respone.toObject();
      return res.status(200).json({userData, mes: "Register successfull! Please go to login"})
    } else {
      throw new Error("Invalid Credentials");
    }
  })
const getCurrentUser = asyncHandler(async (req, res) => {
  const {_id} = req.body;
  // Dùng hàm select để chọn hoặc loại bỏ những thuộc tính không mong muốn
  const user = await User.findById(_id).select('-refreshToken -role -password');
  return res.status(200).json({
    success: true,
    user: user ? user: "User not found!"
  })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if(!cookie || !cookie.refreshToken){
    throw new Error("No refreshToken in cookies!");
  }

  /* dùng với await thì lỗi sẽ tự được throw ra, không cần tự throw
    Nếu refreshToken hết hạn thì sẽ báo lỗi jwt expired
  */
  const decode =  await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const respone = await User.findOne({_id: decode._id, refreshToken: cookie.refreshToken });
  return res.status(200).json({
    success: respone ? true : false,
    newAccessToken: respone ? generateAccessToken(respone._id, respone.role) : "Refresh token isn't matched!" 
  })
})

const logOut = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if(!cookie || !cookie.refreshToken) throw new Error("No refresh token in cookies!");
  // Xóa refreshToken ở database
  await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ""}, {new: true});
  // Xóa refreshToken ở cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true
  })

  return res.status(200).json({
    success: true,
    message: "Logout is done!!"
  })
})

const forgotPassword = asyncHandler( async (req, res) => {
  const {email} = req.query;
  if(!email) throw new Error("Missing email!");
  const user = await User.findOne({email})
  if(!user) throw new Error("User not found!");
  const resetPasswordToken = user.createPasswordChangeToken();
  await user.save();
  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn. Link này có hiệu lực trong vòng 15 phút kể từ bây giờ. <a href=${process.env.SERVER_URL}/api/user/resetpassword/${resetPasswordToken}>Click here </a>`
  const data = {
    email,
    html
  }

  const rs = await  sendEmail(data)
  return res.status(200).json({
    success: true,
    rs
  })
})

const resetPassword = asyncHandler(async (req, res) => {
  const {passwordResetToken, newPassword} = req.body;
  const passwordResetTokenHashed = crypto.createHash('sha256').update(passwordResetToken).digest('hex');
  const user = await User.findOne({passwordResetTokenHashed, passwordResetTokenExpires: {$gt: Date.now()}})
  if(!user) throw new Error("Invalid reset token or reset token expired!");
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwordResetTokenExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: true,
    mes: user ? "Reset password successfully!" : "Something went wrong!!"
  })
})

const getUsers = asyncHandler( async (req, res) => {
  const { role } = req.user;
  if(role !== 'admin') throw new Error("Require admin role!");
  const users = await User.find().select('-password -refreshToken ');
  return res.status(200).json({
    success: true,
    users
  })
})


// module.exports = new Account();
module.exports = {
  login,
  registerAcc,
  updateAcc,
  deleteAcc,
  getCurrentUser,
  refreshAccessToken,
  logOut,
  forgotPassword,
  resetPassword,
  getUsers,
  logined,
  adminUpdateAccEmp
}
