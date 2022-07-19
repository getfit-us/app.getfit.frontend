const Exercise = require('../model/Exercise')


const getExercise = async (req, res) => {
  const exercise = await Exercise.find();

  if (!exercise) return res.status(204).json({ "message": "no exercises found" }) // no content 
  res.json(exercise)

}

const createExercise = async (req, res) => {
  console.log(`Create Exercise: ${req.body.exerciseName} type: ${req.body.exerciseType} `);
  const {Type, exerciseName} = req.body;



  if (!Type || !exerciseName) {
    return res.status(400).json({ 'message': 'type and name are required' });
  }


  try {
    const result = await Exercise.create({
      type: req.body.Type,
      name: req.body.exerciseName,
     

    });
    res.status(201).json(result);

  } catch (err) {

    console.log(err)
  }



}





module.exports =  {getExercise, createExercise};