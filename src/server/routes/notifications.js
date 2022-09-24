const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router.route("/:id").get(notificationController.getNotification); // gets all notifications for  user ID
// add notification
router
  .route("/")
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer),
    notificationController.createNotification
  );
// delete with notification id
router
  .route("/:id")
  .delete(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer),
    notificationController.delNotification
  );
// get list of client notifications with users Trainer ID
router
  .route("/clients/:id")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Trainer),
    notificationController.getClientNotifications
  );
// update notification with
router
  .route("/")
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer),
    notificationController.updateNotification
  );

// router
//   .route("name/:id")
//   .get(
//     verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer),
//     notificationController.getSender
//   );
module.exports = router;
