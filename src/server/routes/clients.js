const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');

router.route('/')
    .get(clientController.getAllClients)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client), clientController.createNewClient)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client), clientController.updateClient)
    .delete(verifyRoles(ROLES_LIST.Admin), clientController.deleteClient);

router.route('/:id')
    .get(clientController.getClient);

module.exports = router;