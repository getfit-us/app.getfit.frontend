const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');


//veify email with token
router.route('/:id/:token').get(usersController.verifyEmail)