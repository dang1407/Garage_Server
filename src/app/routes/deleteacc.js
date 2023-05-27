const express = require('express');
const router = express.Router();

const deleteAcc = require('../Controller/DeleteAcc');

router.delete('/:email', deleteAcc.index);
// router.get('/', deleteAcc.hello);


module.exports = router;