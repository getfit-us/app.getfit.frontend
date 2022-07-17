
const usersList = (req, res, next) => {

  console.log(`users route: ${req.url}`)
  
    const usersList =  [
        {
          "id": "0",
          "firstName": "chris",
          "lastName": "scott",
          "email": "chrisscott@gmail.com",
          "password": "password",
          "phone": "555-1234"
        },
        {
          "firstName": "sam",
          "lastName": "scott",
          "email": "chrisscott@gmail.com",
          "password": "password",
          "phone": "555-1234",
          "id": "x7bzXQg"
        },
        {
          "firstName": "Christopher",
          "lastName": "Scott",
          "email": "Chris@getfit.us",
          "phoneNum": "7863737921",
          "password": "rertretretertr",
          "id": "0G3b8k0"
        }
      ]
      
      res.send(usersList);

}

module.exports =  {usersList};
