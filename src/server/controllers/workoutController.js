//temp before database implementation
const usersDB = {
    users: require('../model/workouts.json'),
    setWorkouts: function (data) { this.workouts = data }
}
const fsPromises = require('fs').promises;
const path = require('path');




const workoutList = (req, res, next) => {
  
    console.log(`Client Route: ${req.url} `) 
      const workoutList =   [
        {
          "id": "0",
          "firstName": "chris",
          "lastName": "scott",
          "email": "chrisscott@gmail.com",
          "password": "password",
          "phone": "555-1234"
        },
        {
          "id": "1",
          "firstName": "bill",
          "lastName": "scott",
          "email": "chrisscott@gmail.com",
          "password": "password",
          "phone": "555-1234"
        }
      ]
        


        res.json(workoutList);
  
     
  }
  
  module.exports =  {workoutList};
  