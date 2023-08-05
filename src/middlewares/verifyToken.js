// verify các token mà client gửi lên

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler(async (req, res, next) => {
      // accessToken(dùng để đăng nhập) được bắt đầu bằng Bearer
      /* 
      headers: {
            authorization: "Bearer token"
      }
      */
      if(req?.headers?.authorization?.startsWith('Bearer')){
            const token = req.headers.authorization.split(' ')[1];
            // console.log("Token: " + token);
            jwt.verify(token, process.env.JWT_SECRET, (err, decode) =>{
                  if(err) return res.status(401).json({
                        success: false,
                        message: "Invalid access token!"
                  })
                  /* decode là thông tin giải mã, trong trường hợp này là id và role
                  (Tham số đầu vào của hàm generateToken) */
                  // console.log(decode);
                  // thêm id và role của user vào request
                  req.user = decode;
                  next();
            } )
      } else {
            res.status(401).json({
                  success: false,
                  message: "Require authorization!!!"
            })
      }
})

const isAdmin = asyncHandler(async (req, res, next) => {
      const { role } = req.user;
      if(role !== 'admin') throw new Error("Require admin role!");
      next()
})

module.exports = {
      verifyAccessToken,
      isAdmin
}