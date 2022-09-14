const Measurement = require('../model/Measurement')
const path = require("path");
const fs = require('fs');




const delMeasurement = async (req, res) => {

  const id = req.params['id'];

  if (!req.params['id'] && req.params['id'] !== undefined) return res.status(400).json({ 'message': 'Measurement ID required' });
  const measurement = await Measurement.findOne({ _id: id }).exec();

  if (!measurement) return res.status(204).json({ "message": "no Measurement found" }) // no content 

  const result = await Measurement.deleteOne({ _id: id });
  res.json(result);

}

const getMeasurement = async (req, res) => {
  //single measurement

  const id = req.params['id'];

  if (!req.params['id'] && req.params['id'] !== undefined) return res.status(400).json({ 'message': 'Client ID required' });
  const measurement = await Measurement.findOne({ _id: id }).exec();

  if (!measurement) return res.status(204).json({ "message": "no measurement found" }) // no content 

  res.json(measurement);

}




const getAllMeasurements = async (req, res) => {
  //all measurements for single client
  console.log('measurement get all  route');
  //sort by most recent date

  const id = req.params['id'];

  if (!req.params['id'] && req.params['id'] !== undefined) return res.status(400).json({ 'message': 'Client ID required' });

  const measurement = await Measurement.find({ clientId: req.params['id'] }).sort('-date').exec();
  

  if (!measurement) return res.status(204).json({ "message": "no measurements found" }) // no content 
  
  res.json(measurement);

}

const createMeasurement = async (req, res) => {
  console.log('create measurement route');

  const MB = 3;
  const FILE_SIZE_LIMIT = MB * 1024 * 1024;
  const filesOverSizeLimit = []
  const files = req.files;
  let fileName = [];

  if (!req.body.id) return res.status(400).json({ status: 'error', message: 'clientId' });

  if (req.files) {


    Object.keys(files).forEach(key => {

      if (files[key].size > FILE_SIZE_LIMIT) {
        filesOverSizeLimit.push(files[key].name)
      } else {
        let fileExt = files[key].name.slice(-4);
        files[key].name = Math.floor(Math.random() * Date.now()) + fileExt;
        fileName.push(files[key].name);


      }

    })

    if (filesOverSizeLimit.length) {
      return res.status(413).json({ message: `File is greater then ${MB}` });
    } else {
      Object.keys(files).forEach(key => {
        const filepath = path.join(__dirname, './../public/measurement_images', files[key].name)
        files[key].mv(filepath, (err) => {
          if (err) return res.status(500).json({ status: "error", message: err })
        })
      })
  
    }

  }


  //Check for duplicate Measurement
  const duplicate = await Measurement.findOne({ clientId: req.body.id, date: req.body.date }).exec();

  if (duplicate) {
    return res.sendStatus(409); //conflict 
  }







 

  try {
    const result = await Measurement.create({
      clientId: req.body.id,
      date: req.body.date,
      weight: req.body.weight,
      bodyfat: req.body?.bodyfat,
      images: fileName,
      notes: req.body?.notes




    });
    res.status(201).json(result);



  } catch (err) {

    console.log(err)
  }



}

const updateMeasurement = async (req, res) => {

  console.log(`update Measurement: ${req.body._id}`);

  if (!req?.body?._id) {
    return res.status(400).json({ 'message': 'ID  required' })
  }

  const measurement = await Measurement.findOne({ _id: req.body._id }).exec();

  if (!measurement) return res.status(204).json({ "message": "no exercises found" }) // no content 

  if (req.body.notes) measurement.notes = req.body.notes;
  if (req.body.weight) measurement.weight = req.body.weight;
  if (req.body.bodyfat) measurement.bodyfat = req.body.bodyfat;




  const result = await measurement.save();
  res.json(result);


}





module.exports = { createMeasurement, updateMeasurement, delMeasurement, getMeasurement, getAllMeasurements };