const Exercise = require("../model/Exercise");
const UsedExercise = require("../model/UsedExercise");

const getUsedExercise = async (req, res, next) => {

  console.log(`get used exercise api call`)
  if (!req.params["id"])
    return res.status(404).json({ message: "You must specify an id " });
  // if user id is not linked to any exercise then return 404
  const recentlyUsedExercises = await UsedExercise.findOne({
    clientId: req.params["id"],
  }).exec();
  //if nothing found send 404
  if (!recentlyUsedExercises)
    return res.status(404).json({ message: "Not Found" });
  // return results if found
  console.log(recentlyUsedExercises)
  return res.status(200).json(recentlyUsedExercises.exercises);
};

const addUsedExercise = async (req, res, next) => {
  console.log(`add used exercise api call`, req.body)
 
  if (!req.body.id || !req.body.exercises)
    return res.status(404).json({ message: "Client ID Required " });
   
  //find existing history
  const existingExerciseHistory = await UsedExercise.findOne({ clientId: req.body.id }).exec();
  // if nothing found create new history
  if (!existingExerciseHistory) {
    console.log(`create new used exercise history`);
    try {
      const result = await UsedExercise.create({
        clientId: req.body.id,
        exercises: req.body.exercises,
  
      });
      res.status(201).json(result.exercises);
    } catch (err) {
      console.log(err);
    }
    // return results if found
  } else {
    console.log(`existing used exercise history adding to it`)
    //if already exists update  existing
    req.body.exercises.map((exercise) => existingExerciseHistory.exercises.push(exercise));
    // remove duplicates
    const arrUniq = [...new Map(existingExerciseHistory.exercises.map(v => [v._id, v])).values()]

    console.log(arrUniq)
    existingExerciseHistory.exercises = arrUniq
    
    
    const result = await existingExerciseHistory.save();
    return res.status(200).json(req.body.exercises);
    

  }
  
  
  
};


const delExercise = async (req, res) => {
  const id = req.params["id"];

  if (!req.params["id"] && req.params["id"] !== undefined)
    return res.status(400).json({ message: "Exercise ID required" });
  const exercise = await Exercise.findOne({ _id: id }).exec();

  if (!exercise) return res.status(204).json({ message: "no exercises found" }); // no content

  const result = await Exercise.deleteOne({ _id: id });
  res.json(result);
};

const getExercise = async (req, res) => {
  const exercise = await Exercise.find();

  if (!exercise) return res.status(204).json({ message: "no exercises found" }); // no content
  res.json(exercise);
};

const createExercise = async (req, res) => {
  console.log(
    `Create Exercise: ${req.body.exerciseName} type: ${req.body.type} `
  );
  const { type, exerciseName } = req.body;

  if (!type || !exerciseName) {
    return res.status(400).json({ message: "type and name are required" });
  }

  //Check for duplicate names
  const duplicate = await Exercise.findOne({
    name: exerciseName.toUpperCase(),
  }).exec();

  if (duplicate) {
    console.log(duplicate);
    return res.sendStatus(409);
  }

  try {
    const result = await Exercise.create({
      type: req.body.type,
      name: req.body.exerciseName.toUpperCase(),
      desc: req.body.desc,
    });
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
  }
};

const updateExercise = async (req, res) => {
  console.log(`update exercise: ${req.body.name}`);

  if (!req?.body?._id) {
    return res.status(400).json({ message: "ID param required" });
  }

  const exercise = await Exercise.findOne({ _id: req.body._id }).exec();

  if (!exercise) return res.status(204).json({ message: "no exercises found" }); // no content

  if (req.body.type) exercise.type = req.body.type;
  if (req.body.desc) exercise.desc = req.body.desc;
  if (req.body.name) exercise.name = req.body.name.toUpperCase();

  const result = await exercise.save();
  res.json(result);
};

module.exports = { getExercise, createExercise, updateExercise, delExercise, getUsedExercise, addUsedExercise };
