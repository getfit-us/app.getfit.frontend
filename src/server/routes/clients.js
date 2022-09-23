const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');
//trainer id is required
router.route('/all/:id')
    .get(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Trainer), clientController.getAllClients)

router.route('/:id').delete(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Trainer), clientController.deleteClient);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), clientController.getClient)

router.route('/').put(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Trainer), clientController.updateClient);


module.exports = router;