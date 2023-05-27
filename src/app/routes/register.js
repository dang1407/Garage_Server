const express = require('express');
const router = express.Router();
const registerController = require('../Controller/RegisterController');

router.post('/', registerController.postUserAcc);
router.get('/', registerController.index);
module.exports = router;