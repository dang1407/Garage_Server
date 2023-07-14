const jwt = require('jsonwebtoken');
// console.log(process.env.JWT_SECRET)
// 3d và 7d thì được hiểu luôn là 3 ngày và 7 ngày, nếu giây là s
const generateAccessToken = (userId, role) => jwt.sign({_id: userId, role}, process.env.JWT_SECRET, {expiresIn: "3d"})
const generateRefreshToken = (userId) => jwt.sign({_id: userId}, process.env.JWT_SECRET, {expiresIn: "7d"})


module.exports = {
      generateAccessToken,
      generateRefreshToken
}