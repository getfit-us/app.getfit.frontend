const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');


router.route('/')
.get(exerciseController.getExercise)
.post(exerciseController.createExercise)

module.exports = router;