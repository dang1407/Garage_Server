const express = require('express');
const router = express.Router();

const account = require('../Controller/Account');
const { verifyAccessToken, isAdmin } = require('../../middlewares/verifyToken');

router.post('/login', account.login);
router.get('/logined', verifyAccessToken,  account.logined)
router.post('/register', account.registerAcc);
router.put('/updateacc', verifyAccessToken,  account.updateAcc);
router.put('/adminupdateacc', verifyAccessToken, isAdmin,   account.adminUpdateAccEmp);
router.delete('/deleteacc/:id', verifyAccessToken, account.deleteAcc);
router.post('/getuserbyid', account.getCurrentUser)
router.post('/refreshtoken', account.refreshAccessToken);
router.post('/logout', verifyAccessToken, account.logOut);
router.get('/forgotpassword', account.forgotPassword);
router.get('/getusers', verifyAccessToken, isAdmin, account.getUsers)
// router.get('/getusers', account.getUsers)
module.exports = router;