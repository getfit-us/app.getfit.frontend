const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');



router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Client), usersController.getTrainer);

module.exports = router;