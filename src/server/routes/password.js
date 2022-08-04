const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

router.put('/', passwordController.handleUpdatePassword);

module.exports = router;