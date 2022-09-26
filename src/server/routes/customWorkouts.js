const express = require("express");
const router = express.Router();
const customWorkoutController = require("../controllers/customWorkoutController");
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router
  .route("/")
  .get(
    verifyRoles(ROLES_LIST.Admin),
    customWorkoutController.getAllCustomWorkouts
  )
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer),
    customWorkoutController.createCustomWorkout
  )
  .put(
    verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Trainer),
    customWorkoutController.updateCustomWorkout
  );
  //delete Custom workout by ID of workout
router
  .route("/:id")
  .delete(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer),
    customWorkoutController.delWorkout
  );
//Get customworkout by ID of workout
router
  .route("/:id")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer),
    customWorkoutController.getWorkout
  );

//Workouts Created by CLIENT ID
router
  .route("/client/:id")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer),
    customWorkoutController.getWorkoutsCreatedByUser
  );

// need to add route for clients to get all there workouts
router
  .route("/client/assigned/:id")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Client, ROLES_LIST.Trainer),
    customWorkoutController.getWorkoutsAssigned
  );

module.exports = router;
