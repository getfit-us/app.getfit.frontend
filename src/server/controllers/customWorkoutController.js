
const CustomWorkout = require('../model/customWorkout')

//Custom workout Controller 


const delWorkout = async (req, res) => {

  const id = req.params['id'];

  if (!req.params['id'] && req.params['id'] !== undefined) return res.status(400).json({ 'message': 'Workout ID required' });
  const workout = await CustomWorkout.findOne({ _id: id }).exec();

  if (!workout) return res.status(204).json({ "message": "no exercises found" }) // no content 

  const result = await CustomWorkout.deleteOne({ _id: id });
  res.json(result);

}
//Get workout by ID
const getWorkout = async (req, res) => {

  const id = req.params['id'];

  if (!req.params['id'] && req.params['id'] !== undefined) return res.status(400).json({ 'message': 'Workout ID required' });
  const workout = await CustomWorkout.findOne({ _id: id }).exec();

  if (!workout) return res.status(204).json({ "message": "no exercises found" }) // no content 

  res.json(workout);

}
//get all workouts linked to CLIENT ID
const getSingleClientWorkouts = async (req, res) => {

  const id = req.params['id'];

  //id is client ID instead of workout ID
  console.log(`Get all client Custom Workouts`)


  if (!req.params['id'] && req.params['id'] !== undefined) return res.status(400).json({ 'message': 'Client ID required' });

  //workouts are sent back in ascending order (Latest Date first)
  const workouts = await CustomWorkout.find({ clientId: id }).sort('-date').exec();


  if (!workouts) return res.status(204).json({ "message": "no workouts found for current client" }) // no content 

  res.json(workouts);

}

// Get ALL customworkouts in DB ADMIN ONLY

const getAllCustomWorkouts = async (req, res) => {

  console.log('workout get route');
  const workout = await CustomWorkout.find();

  if (!workout) return res.status(204).json({ "message": "no workouts found" }) // no content 
  res.json(workout)

}
// CREATE NEW WORKOUT
const createCustomWorkout = async (req, res) => {
  console.log(`Create Custom workout: ${req.body} `);


  if (!req?.body?.id &&  !req?.body?.exercises && !req?.body?.name) {
    return res.status(400).json({ 'message': 'Missing values' });
  }



  //Check for duplicate names
  const duplicate = await CustomWorkout.findOne({ clientId: req.body.id, name: req.body.name }).exec();

  if (duplicate) {

    if (duplicate.date === req.body.date) return res.sendStatus(409);

  }

  try {
    const result = await CustomWorkout.create({
      clientId: req.body.id,
      name: req.body.name,
      exercises: req.body.exercises,
    
      



    });
    res.status(201).json(result);

  } catch (err) {

    console.log(err)
  }



}

const updateCustomWorkout = async (req, res) => {
    //use id of customworkout to update
  console.log(`update exercise: ${req.body.name}`);

  if (!req?.body?._id) {
    return res.status(400).json({ 'message': 'ID param required' })
  }

  const exercise = await CustomWorkout.findOne({ _id: req.body._id }).exec();

  if (!exercise) return res.status(204).json({ "message": "no exercises found" }) // no content 

  if (req.body.type) exercise.type = req.body.type;
  if (req.body.name) exercise.name = req.body.name.toUpperCase();


  const result = await exercise.save();
  res.json(result);


}





module.exports = { getAllCustomWorkouts, createCustomWorkout, updateCustomWorkout, delWorkout, getWorkout, getSingleClientWorkouts };