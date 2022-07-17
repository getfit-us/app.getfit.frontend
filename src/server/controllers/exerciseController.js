const Exercise = require('../model/Exercise')


const getExercise = async (req, res) => {
  const exercise = await Exercise.find();

  if (!exercise) return res.status(204).json({ "message": "no exercises found" }) // no content 
  res.json(exercise)

}

const createExercise = async (req, res) => {
  if (!req?.body?.type || !req?.body?.name) {
    return res.status(400).json({ 'message': 'type and name are required' });
  }


  try {
    const result = await Exercise.create({
      type: req.body.type,
      name: req.body.name,
     

    });
    res.status(201).json(result);

  } catch (err) {

    console.log(err)
  }



}





module.exports =  {getExercise, createExercise};