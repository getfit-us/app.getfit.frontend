const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');

router.get('/', exerciseController.exerciseList);

module.exports = router;