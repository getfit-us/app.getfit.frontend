

const exerciseList = (req, res, next) => {
   const exercises =  [
        {
          "id": 0,
          "name": "Pull ups",
          "type": "pull"
        },
        {
          "id": 1,
          "name": "Push Ups",
          "type": "push"
        },
        {
          "id": 2,
          "name": "Barbell Rows",
          "type": "pull"
        },
        {
          "id": 3,
          "name": "T-bar Rows",
          "type": "pull"
        },
        {
          "id": 4,
          "name": "High Row",
          "type": "pull"
        },
        {
          "id": 5,
          "name": "One arm dumbbell row",
          "type": "pull"
        },
        {
          "id": 6,
          "name": "DeadLift",
          "type": "pull"
        },
        {
          "id": 7,
          "name": "Lat Pull Down",
          "type": "pull"
        }
      ]

      res.send(exercises)

}

module.exports =  {exerciseList};