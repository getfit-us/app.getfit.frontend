const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');


//veify email with token
router.get('/:id/:token', usersController.verifyEmail);


module.exports = router;
