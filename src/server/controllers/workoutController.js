const Workout = require("../model/CompletedWorkout");
const Notification = require("../model/Notification");
const User = require("../model/User");
const {COMPLETED_WORKOUT}  = require("../config/Messages");

const delWorkout = async (req, res) => {
  const id = req.params["id"];

  if (!req.params["id"] && req.params["id"] !== undefined)
    return res.status(400).json({ message: "Workout ID required" });
  const workout = await Workout.findOne({ _id: id }).exec();

  if (!workout) return res.status(204).json({ message: "no exercises found" }); // no content

  const result = await Workout.deleteOne({ _id: id });
  res.json(result);
};

const getWorkout = async (req, res) => {
  console.log("get single completed workout");
  const id = req.params["id"];

  if (!req.params["id"] && req.params["id"] !== undefined)
    return res.status(400).json({ message: "Workout ID required" });
  const workout = await Workout.findOne({ _id: id }).exec();

  if (!workout) return res.status(204).json({ message: "no exercises found" }); // no content

  res.json(workout);
};

const getSingleClientWorkouts = async (req, res) => {
  const id = req.params["id"];

  //id is client ID instead of workout ID
  console.log(`Get all client workouts`);

  if (!req.params["id"] && req.params["id"] !== undefined)
    return res.status(400).json({ message: "Client ID required" });

  //workouts are sent back in ascending order (Latest Date first)
  const workouts = await Workout.find({ clientId: id }).sort("-date").exec();

  if (!workouts)
    return res
      .status(204)
      .json({ message: "no workouts found for current client" }); // no content

  res.json(workouts);
};

const getAllWorkouts = async (req, res) => {
  console.log("workout get route");
  const workout = await Workout.find();

  if (!workout) return res.status(204).json({ message: "no workouts found" }); // no content
  res.json(workout);
};

const createWorkout = async (req, res) => {
  //Save Custom Workout After Completing
  console.log(`Save Completed workout: ${req.body} `);

  if (!req?.body?.id && !req?.body?.exercises) {
    return res.status(400).json({ message: "Missing values" });
  }

  //Check for duplicate Completed Workout with same ClientId and Same Date Completed
  const duplicate = await Workout.findOne({
    clientId: req.body.id,
    dateCompleted: req.body.dateCompleted,
    name: req.body.name,
  })
    .lean()
    .exec();

  if (duplicate) {
    if (duplicate.date === req.body.date) return res.sendStatus(409);
  }

  try {
    const result = await Workout.create({
      clientId: req.body.id,
      dateCompleted: req.body.dateCompleted,
      name: req.body.name,
      rating: req.body?.rating,
      exercises: req.body.exercises,
      Created: req.body.Created,
      feedback: req.body?.feedback,
    });
    //get user account
    const user = await User.findOne({
      _id: req.body.id,
    });

    const trainer = await User.findOne({ _id: user.trainerId});

    let msgs = COMPLETED_WORKOUT(user, trainer, req);

    if (user) {
     
      //--add notification to users activity feed
      let date = result.dateCompleted.toString();
      date = date.split("T");
      const notifyUser = await new Notification({
        type: "activity",
        sender: { name: `${user.firstname} ${user.lastname}`, id: user._id },
        receiver: { id: user._id },
        trainerID: user.trainerId,
        message: msgs.userMSG,
        activityID: result._id,
      }).save();
    }

    if (trainer) {
     ///---- notify trainer of activity
     const notify = await new Notification({
      type: "activity",
      sender: { name: `${user.firstname} ${user.lastname}`, id: user._id },
      receiver: { id: user.trainerId },
      trainerID: user.trainerId,
      message: msgs.trainerMSG,
      activityID: result._id,
    }).save();

    }

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
  }
};

const updateWorkout = async (req, res) => {

  //this needs to be fixed
  console.log(`update exercise: ${req.body.name}`);

  if (!req?.body?._id) {
    return res.status(400).json({ message: "ID param required" });
  }

  const exercise = await Exercise.findOne({ _id: req.body._id }).exec();

  if (!exercise) return res.status(204).json({ message: "no exercises found" }); // no content

  if (req.body.type) exercise.type = req.body.type;
  if (req.body.name) exercise.name = req.body.name.toUpperCase();

  const result = await exercise.save();
  res.json(result);
};

module.exports = {
  getAllWorkouts,
  createWorkout,
  updateWorkout,
  delWorkout,
  getWorkout,
  getSingleClientWorkouts,
};
