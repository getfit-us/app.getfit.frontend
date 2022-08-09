const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router.route('/')
.get(verifyRoles(ROLES_LIST.Admin),workoutController.getAllWorkouts)
.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer),workoutController.createWorkout)
.put(verifyRoles(ROLES_LIST.Admin),workoutController.updateWorkout);
router.route('/:id').delete(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Client,ROLES_LIST.Trainer),workoutController.delWorkout);
router.route('/:id').get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer),workoutController.getWorkout);


// need to add route for clients to get all there workouts 
module.exports = router;