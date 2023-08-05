const express = require('express');
const router = express.Router();
const uploadCloud = require('../../config/cloudinary/cloudinary.config')
const parkingfee = require('../Controller/ParkingFeeController');
const { verifyAccessToken, isAdmin } = require('../../middlewares/verifyToken');

router.post('/out', verifyAccessToken, parkingfee.parkingFeeCalculate)
router.post('/in', verifyAccessToken, parkingfee.parkingIn)

module.exports = router