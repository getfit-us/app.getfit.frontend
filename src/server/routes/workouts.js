const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router.route('/')
.get(workoutController.getWorkout)
.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client),workoutController.createWorkout)
.put(verifyRoles(ROLES_LIST.Admin),workoutController.updateWorkout);
router.route('/:id').delete(verifyRoles(ROLES_LIST.Admin),workoutController.delWorkout);

module.exports = router;