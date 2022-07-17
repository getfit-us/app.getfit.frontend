//temp before database implementation


const clientList = (req, res, next) => {
  
  console.log(`Client Route: ${req.url} `) 
    const clientList =   [
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
      
      res.json(clientList);

   
}

module.exports =  {clientList};
