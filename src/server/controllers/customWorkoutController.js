const CustomWorkout = require("../model/CustomWorkout");
const {
  UPDATED_CUSTOM_WORKOUT,
  CREATED_NEW_CUSTOM_WORKOUT,
} = require("../config/Messages");

const Notification = require("../model/Notification");
const User = require("../model/User");

//Custom workout Controller

const delWorkout = async (req, res) => {
  const id = req.params["id"];
  console.log("delete custom workout");
  if (!req.params["id"] && req.params["id"] !== undefined)
    return res.status(400).json({ message: "Workout ID required" });
  const workout = await CustomWorkout.findOne({ _id: id }).exec();

  if (!workout) return res.status(204).json({ message: "no exercises found" }); // no content

  const result = await CustomWorkout.deleteOne({ _id: id });
  if (result.acknowledged) res.json(workout);
};
//Get workout by ID
const getWorkout = async (req, res) => {
  const id = req.params["id"];

  if (!req.params["id"] && req.params["id"] !== undefined)
    return res.status(400).json({ message: "Workout ID required" });
  const workout = await CustomWorkout.findOne({ _id: id }).exec();

  if (!workout) return res.status(204).json({ message: "no exercises found" }); // no content

  res.json(workout);
};
//get all workouts linked to CLIENT ID (created by user)
const getWorkoutsCreatedByUser = async (req, res) => {
  const id = req.params["id"];

  //id is client ID instead of workout ID
  console.log(`Get all client Custom Workouts`);

  if (!req.params["id"] && req.params["id"] !== undefined)
    return res.status(400).json({ message: "Client ID required" });

  //workouts are sent back in ascending order (Latest Date first)
  const workouts = await CustomWorkout.find({ clientId: id })
    .sort("-date")
    .exec();

  if (!workouts)
    return res
      .status(204)
      .json({ message: "no workouts found for current client" }); // no content

  res.json(workouts);
};

//get all workouts assigned to user
const getWorkoutsAssigned = async (req, res) => {
  const id = req.params["id"];

  //id is client ID instead of workout ID
  console.log(`Get all assigned Custom Workouts`);

  if (!req.params["id"] && req.params["id"] !== undefined)
    return res.status(400).json({ message: "Client ID required" });

  //workouts are sent back in ascending order (Latest Date first)
  const workouts = await CustomWorkout.find({ assignedIds: id })
    .sort("-date")
    .exec();

  if (!workouts)
    return res
      .status(204)
      .json({ message: "no workouts found for current client" }); // no content

  res.json(workouts);
};

// Get ALL customworkouts in DB ADMIN ONLY

const getAllCustomWorkouts = async (req, res) => {
  console.log("workout get route");
  const workout = await CustomWorkout.find();

  if (!workout) return res.status(204).json({ message: "no workouts found" }); // no content
  res.json(workout);
};

// ---------------------CREATE NEW WORKOUT---------------------
const createCustomWorkout = async (req, res) => {
  console.log(`Create Custom workout: ${JSON.stringify(req.body)} `);

  if (!req?.body?.id && !req?.body?.exercises && !req?.body?.name) {
    return res.status(400).json({ message: "Missing values" });
  }

  //Check for duplicate names
  const duplicate = await CustomWorkout.findOne({
    clientId: req.body.id,
    name: req.body.name,
  }).exec();

  if (duplicate) {
    if (duplicate.date === req.body.date) return res.sendStatus(409);
  }

  try {
    const result = await CustomWorkout.create({
      clientId: req.body.id,
      name: req.body.name,
      exercises: req.body.exercises,
    });

    //get user account
    const user = await User.findOne({
      _id: req.body.id,
    });
    //get trainer info
    const trainer = await User.findOne({
      _id: user.trainerId,
    });
    let msgs = CREATED_NEW_CUSTOM_WORKOUT(user, trainer, req);

    if (trainer) {
      ///---- notify trainer of activity created new workout

      const notify = await new Notification({
        type: "activity",
        sender: { name: `${user.firstname} ${user.lastname}`, id: user._id },
        receiver: { id: user?.trainerId ? user?.trainerId : req.body.id },
        trainerID: user?.trainerId ? user?.trainerId : req.body.id,
        message: msgs.trainerMSG,
        activityID: result._id,
      }).save();
    }
    if (user) {
      //--add notification to users activity feed -- created new workout
      const notifyUser = await new Notification({
        type: "activity",
        sender: {
          name: trainer
            ? `${trainer.firstname} ${trainer.lastname}`
            : "You added",
          id: user?.trainerId ? user?.trainerId : req.body.id,
        },
        receiver: { id: user._id },
        trainerID: user?.trainerId,
        message: msgs.userMSG,
        activityID: result._id,
      }).save();
    }

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
  }
};

const updateCustomWorkout = async (req, res) => {
  //use id of customworkout to update
  console.log(`update exercise: ${JSON.stringify(req.body)}`);

  if (!req?.body?._id) {
    return res.status(400).json({ message: "Workout ID required" });
  }

  const workout = await CustomWorkout.findOne({ _id: req.body._id }).exec();

  if (!workout) return res.status(204).json({ message: "No Workout found" }); // no content

  //compare assignedIds array with updated one grab ids that dont match existing document

  let newIds = req.body.assignedIds.filter(
    (id) => !workout.assignedIds.includes(id)
  );
  // this does not work

  console.log("new Ids added to workout", newIds);

  if (req.body?.exercises) workout.type = req.body.exercises;
  if (req.body?.assignedIds) workout.assignedIds = req.body.assignedIds;
  if (req.body?.name) workout.name = req.body.name.toUpperCase();

  const result = await workout.save();

  //----- if only one new user --- if not do for loop ---

  if (newIds.length === 1) {
    console.log("one new id found in assignedIds");
    //get user account with new assigned workout to send notifications
    const user = await User.findOne({
      _id: newIds[0],
    });
    //get trainer info
    const trainer = await User.findOne({
      _id: user.trainerId,
    });

    let msgs = UPDATED_CUSTOM_WORKOUT(user, trainer, req);

    if (user) {
      //--add notification to users activity feed new assignment
      const notifyUser = await new Notification({
        type: "activity",
        sender: {
          name: `${trainer.firstname} ${trainer.lastname}`,
          id: trainer._id,
        },
        receiver: { id: user._id },
        trainerID: user.trainerId,
        message: msgs.userMSG,
        activityID: result._id,
      }).save();
    }

    if (trainer) {
      ///---- notify trainer of activity new assignment

      const notify = await new Notification({
        type: "activity",
        sender: { name: `${user.firstname} ${user.lastname}`, id: user._id },
        receiver: { id: user.trainerId },
        trainerID: user.trainerId,
        message: msgs.trainerMSG,
        activityID: result._id,
      }).save();
    }
  } else if (newIds.length > 1) {
    console.log("more then one id found in assignedIds");
    //if more then one user has been assigned the grab each user / trainer and send the notifications

    for (var i = 0; i < newIds.length; i++) {
      //get user account with new assigned workout to send notifications
      const user = await User.findOne({
        _id: newIds[0],
      });
      //get trainer info
      const trainer = await User.findOne({
        _id: user.trainerId,
      });

      let msgs = UPDATED_CUSTOM_WORKOUT(user, trainer, req.body);
      if (user) {
        //get user account with new assigned workout to send notifications
        const notify = await new Notification({
          type: "activity",
          sender: { name: `${user.firstname} ${user.lastname}`, id: user._id },
          receiver: { id: user.trainerId },
          trainerID: user.trainerId,
          message: msgs.userMSG,
          activityID: result._id,
        }).save();
      }
      if (trainer) {
        //--add notification to users activity feed new assignment
        const notifyUser = await new Notification({
          type: "activity",
          sender: {
            name: `${trainer.firstname} ${trainer.lastname}`,
            id: trainer._id,
          },
          receiver: { id: user._id },
          trainerID: user.trainerId,
          message: msgs.trainerMSG,
          activityID: result._id,
        }).save();
      }
    }
  }

  res.json(result);
};

module.exports = {
  getAllCustomWorkouts,
  createCustomWorkout,
  updateCustomWorkout,
  delWorkout,
  getWorkout,
  getWorkoutsCreatedByUser,
  getWorkoutsAssigned,
};
