const Exercise = require('../model/Exercise')


const delExercise = async (req, res) => {
 
  console.log(req.params['id']);
  const id = req.params['id'];

  if (!req.params['id'] && req.params['id'] !== undefined) return res.status(400).json({ 'message': 'Exercise ID required' });
  const exercise = await Exercise.findOne({ _id: id}).exec();

  if (!exercise) return res.status(204).json({ "message": "no exercises found" }) // no content 
 


  const result =  await Exercise.deleteOne({_id: id});
  res.json(result);

}


const getExercise = async (req, res) => {
  const exercise = await Exercise.find();

  if (!exercise) return res.status(204).json({ "message": "no exercises found" }) // no content 
  res.json(exercise)

}

const createExercise = async (req, res) => {
  console.log(`Create Exercise: ${req.body.exerciseName} type: ${req.body.type} `);
  const {type, exerciseName} = req.body;



  if (!type || !exerciseName) {
    return res.status(400).json({ 'message': 'type and name are required' });
  }

  //Check for duplicate names
  const duplicate = await Exercise.findOne({name: exerciseName}).exec();
  
  if (duplicate) {
    const lowerDup = duplicate.name.toLowerCase();
    const lowerExercise = exerciseName.toLowerCase();
      if (lowerDup === lowerExercise) {
        console.log(duplicate);
        return res.sendStatus(409);
      }
   
      
   
    
  } 


  try {
    const result = await Exercise.create({
      type: req.body.type,
      name: req.body.exerciseName,
     

    });
    res.status(201).json(result);

  } catch (err) {

    console.log(err)
  }



}

const updateExercise = async (req, res) => {
  const {Type, exerciseName} = req.body;
  if (req?.body?.id) {
    return res.status(400).json({ 'message': 'ID param required' })
  }






  const exercise = await Exercise.findOne({_id: req.body.id}).exec();

  if (!exercise) return res.status(204).json({ "message": "no exercises found" }) // no content 

  if (req?.body?.Type) Exercise.type  = Type;
  if (req?.body?.exerciseName) Exercise.name = exerciseName;


  const result = await exercise.save();
  res.json(result);


}





module.exports =  {getExercise, createExercise, updateExercise, delExercise};