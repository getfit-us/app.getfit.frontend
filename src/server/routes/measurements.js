const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');
const fileUpload = require('express-fileupload');


router.route('/')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer),fileUpload({createParentPath: true}), measurementController.createMeasurement)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer), measurementController.updateMeasurement);
router.route('/:id').delete(verifyRoles(ROLES_LIST.Admin), measurementController.delMeasurement);
//gets a single measurement based of _id 
router.route('/:id').get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer), measurementController.getMeasurement);
//gets all measurements tagged to clientId 
router.route('/client/:id').get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer), measurementController.getAllMeasurements);


module.exports = router;