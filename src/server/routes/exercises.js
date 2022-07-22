const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');


router.route('/')
.get(exerciseController.getExercise)
.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client),exerciseController.createExercise)
.put(verifyRoles(ROLES_LIST.Admin),exerciseController.updateExercise);
router.route('/:id').delete(verifyRoles(ROLES_LIST.Admin),exerciseController.delExercise);


module.exports = router;