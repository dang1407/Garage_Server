const express = require('express');
const router = express.Router();

// Controller
const loginController = require('../Controller/LoginController');


router.post('/', loginController.pCheckUserAcc);

module.exports = router;