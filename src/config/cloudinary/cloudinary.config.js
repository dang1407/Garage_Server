const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();
// const cloud_name = process.env.CLOUDINARY_NAME
// const api_key = process.env.CLOUDINARY_KEY
// const api_secret = process.env.CLOUDINARY_SECRET
// console.log(process.env.CLOUDINARY_NAME)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
  // cloud_name: "dmbzrlrot",
  // api_key: "829873173592494",
  // api_secret: "Sn2ob3jVhNgiSozr1HRtZDt5Euo"
});


// cloudinary.uploader.destroy('IMAGE_PUBLIC_ID', function(error, result) {
//   if (error) {
//     console.log('Lỗi xóa ảnh:', error);
//   } else {
//     console.log('Xóa ảnh thành công:', result);
//   }
// });


const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  // filename: function (req, file, cb) {
  //   cb(null, file.originalname); 
  // },
  params: {
    folder: "Garage"
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
