const express = require('express');
const router = express.Router();
const uploadCloud = require('../../config/cloudinary/cloudinary.config')
const account = require('../Controller/Account');
const { verifyAccessToken, isAdmin } = require('../../middlewares/verifyToken');


router.post('/login', account.login);
router.get('/logined', verifyAccessToken,  account.logined)
router.post('/register', account.registerAcc);
router.put('/updateacc', verifyAccessToken,  account.updateAcc);
router.put('/adminupdateacc', verifyAccessToken, isAdmin,   account.adminUpdateAccEmp);
router.delete('/deleteacc/:id', verifyAccessToken, account.deleteAcc);
router.get('/getcurrentuser', verifyAccessToken, account.getCurrentUser)
router.post('/refreshtoken', account.refreshAccessToken);
router.get('/logout', verifyAccessToken, account.logOut);
router.get('/forgotpassword', account.forgotPassword);
router.get('/getusers', verifyAccessToken, isAdmin, account.getUsers)
router.post('/uploadavatar', uploadCloud.single('avatar'), account.uploadUserAvatar)
router.post('/deleteimage', account.adminDeleteImage)
router.put('/userupdateacc', verifyAccessToken, account.userUpdateInf)
router.get('/gettestusers', account.getTestUsers)
module.exports = router;