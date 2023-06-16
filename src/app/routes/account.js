const express = require('express');
const router = express.Router();

const account = require('../Controller/Account');

router.post('/login', account.login);
router.post('/register', account.registerAcc);
router.put('/updateacc', account.updateAcc);
router.delete('/deleteacc/:email', account.deleteAcc);

module.exports = router;