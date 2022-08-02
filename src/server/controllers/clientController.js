//temp before database implementation
const Client = require('../model/Client')





const getAllClients = async (req, res) => {
  console.log('client route');
  const clients = await Client.find();

  if (!clients) return res.status(204).json({ "message": "no clients found" }) // no content 
  res.json(clients)

}

const createNewClient = async (req, res) => {

  if (!req?.body?.firstname && !req?.body?.lastname && !req.body.email && !req?.body?.trainerId) {
    return res.status(400).json({ 'message': 'First and Last names are required' });
  } 

  if (isNaN(req.body.phone)) return res.status(400).json({ 'message': 'Phone number must be digits only' });

  


  //check if client already exists 
  const duplicate = await Client.findOne({email: req.body.email}).exec();

  
  if (duplicate) return res.sendStatus(409);



  try {
    const result = await Client.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      age: req.body.age,
      trainerId: req.body.trainerId,
      roles: {
        Client: 2
      }

    });
    res.status(201).json(result);

  } catch (err) {

    console.log(err)
  }


}


const updateClient = async (req, res) => {
 
  console.log(req.body._id);


  if (!req?.body?._id) {
    return res.status(400).json({ 'message': 'ID  required' })
  }

  const client = await Client.findOne({ _id: req.body._id }).exec();

  if (!client) { return res.status(204).json({ 'message': `no client matches ID ${req.body.client}` }) };

  if (req?.body?.firstname) client.firstname = req.body.firstname;
  if (req?.body?.lastname) client.lastname = req.body.lastname;
  if (req?.body?.email) client.email = req.body.email;
  if (req?.body?.phone) client.phone = req.body.phone;
  if (req?.body?.age) client.age = req.body.age;

  const result = await client.save();
  res.json(result);


}

const deleteClient = async (req, res) => {
  console.log(`client delete route ${req.params['id']}`);

  if (!req.params['id']) return res.status(400).json({ 'message': 'Client ID required' });

  const client = await Client.findOne({ _id: req.params['id'] }).exec();
  if (!client) { return res.status(204).json({ 'message': `no client matches ID ${req.body.id}` }) };

  const result =  await client.deleteOne({_id: req.body.id});
  res.json(result);



}

const getClient = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ 'message': 'Client ID required' });
  const client = await Client.findOne({ _id: req.params.id }).exec();
  if (!client) { return res.status(204).json({ 'message': `no client matches ID ${req.params.id}` }) };

  res.json(client)
 

}


module.exports = { getAllClients, 
  createNewClient,
  updateClient,
  deleteClient,
  getClient,



};
