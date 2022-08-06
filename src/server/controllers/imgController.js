
const User = require('../model/User');
const path = require("path");
const fs = require('fs');
const newImg = async (req, res) => {
    const MB = 3;
    const FILE_SIZE_LIMIT = MB * 1024 * 1024;
    const filesOverSizeLimit = []
    const files = req.files;
    let name = "";
    
  
  
    if (!req.files && !req.body.id ) return res.status(400).json({status: 'error', message: 'no files or clientId'})

    

    Object.keys(files).forEach(key => {
      
        if (files[key].size > FILE_SIZE_LIMIT) {
            filesOverSizeLimit.push(files[key].name)
        } else {
          name = files[key].name;
        }
    });


    if (filesOverSizeLimit.length) {
        return res.status(413).json({message: `File is greater then ${MB}`});
    }

    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) { return res.status(403).json({ 'message': `no user matches ID` }) };

    fs.unlink( `${__dirname}/../public/avatar_images/${user.avatar}`,function(err){
      if(err) return console.log(err);
      console.log(`old avatar deleted successfully `);
 });  
 
    user.avatar = name;


    Object.keys(files).forEach(key => {
      const filepath = path.join(__dirname, './../public/avatar_images', files[key].name)
      files[key].mv(filepath, (err) => {
          if (err) return res.status(500).json({ status: "error", message: err })
      })
  })
 const result = await user.save();

  return res.json({ status: 'success', message: Object.keys(files).toString() })
  
  
  }







const delImg = async (req, res) => {

  const id = req.params['id'];

  if (!req.params['id'] && req.params['id'] !== undefined) return res.status(400).json({ 'message': 'Workout ID required' });
  const workout = await Workout.findOne({ _id: id }).exec();

  if (!workout) return res.status(204).json({ "message": "no exercises found" }) // no content 

  const result = await Workout.deleteOne({ _id: id });
  res.json(result);

}

const getImg = async (req, res) => {

  const id = req.params['id'];

  if (!req.params['id'] && req.params['id'] !== undefined) return res.status(400).json({ 'message': 'Workout ID required' });
  const workout = await Workout.findOne({ _id: id }).exec();

  if (!workout) return res.status(204).json({ "message": "no exercises found" }) // no content 

   res.json(workout);

}


const getAllImg = async (req, res) => {

  console.log('workout get route');
  const workout = await Workout.find();

  if (!workout) return res.status(204).json({ "message": "no workouts found" }) // no content 
  res.json(workout)

}



const updateImg = async (req, res) => {

  console.log(`update exercise: ${req.body.name}`);

  if (!req?.body?._id) {
    return res.status(400).json({ 'message': 'ID param required' })
  }

  const exercise = await Exercise.findOne({ _id: req.body._id }).exec();

  if (!exercise) return res.status(204).json({ "message": "no exercises found" }) // no content 

  if (req.body.type) exercise.type = req.body.type;
  if (req.body.name) exercise.name = req.body.name.toUpperCase();


  const result = await exercise.save();
  res.json(result);


}





module.exports = { getAllImg, newImg, updateImg, delImg, getImg };