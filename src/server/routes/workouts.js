const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

router.get('/', workoutController.workoutList);
router.post('/', workoutController.workoutList);

module.exports = router;