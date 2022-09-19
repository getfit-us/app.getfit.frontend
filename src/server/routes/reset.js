const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');


//email sent to user email, with link to reset password
router.post('/', usersController.resetPassword);
// validate user email address 
router.get('/validate/:id/:token', usersController.validateResetLink);
// allows user to change their password
router.post('/verified', usersController.UpdatePassword)




module.exports = router;
