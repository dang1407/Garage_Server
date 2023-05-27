const express = require('express');
const router = express.Router();
const updateAcc = require('../Controller/UpdateAcc');

router.put('/', updateAcc.index);
router.get('/', updateAcc.hello);
module.exports = router;