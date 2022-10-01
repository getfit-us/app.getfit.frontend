const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .put(verifyRoles(ROLES_LIST.Admin), usersController.updateUsers);

router.route('/:id').delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser)
    .put(verifyRoles(ROLES_LIST.Client,ROLES_LIST.Trainer,ROLES_LIST.Admin), usersController.updateSelf);
  //route for completed goals
    router.route('/goal/:id').put(verifyRoles(ROLES_LIST.Client,ROLES_LIST.Trainer,ROLES_LIST.Admin), usersController.completeGoal);

module.exports = router;