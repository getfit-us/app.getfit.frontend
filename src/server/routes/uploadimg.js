const express = require('express');
const router = express.Router();
const imgController = require('../controllers/imgController');
const ROLES_LIST = require('../config/roles_list');
const verifyRoles = require('../middleware/verifyRoles');
const fileUpload = require('express-fileupload');

router.route('/')
.get(verifyRoles(ROLES_LIST.Admin),imgController.getAllImg)
.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer, ROLES_LIST.User),fileUpload({createParentPath: true}),imgController.newImg)
.put(verifyRoles(ROLES_LIST.Admin),imgController.updateImg);
router.route('/:id').delete(verifyRoles(ROLES_LIST.Admin),imgController.delImg);
router.route('/:id').get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer),imgController.getImg);



module.exports = router;