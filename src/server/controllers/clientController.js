//temp before database implementation
const Client = require('../model/Client')
console.log(`Client Route`)



const getAllClients = async (req, res) => {
  const clients = await Client.find();

  if (!clients) return res.status(204).json({ "message": "no clients found" }) // no content 
  res.json(clients)

}

const createNewClient = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res.status(400).json({ 'message': 'First and last names are required' });
  }


  try {
    const result = await Client.create({
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      email: req.body.email,
      phone: req.body.phoneNum,
      roles: {
        User: { type: Number, default: 1 },
        Client: { type: Number, default: 2 },
      }

    });
    res.status(201).json(result);

  } catch (err) {

    console.log(err)
  }


}


const updateClient = async (req, res) => {
  if (req?.body?.id) {
    return res.status(400).json({ 'message': 'ID param required' })
  }

  const client = await Client.findOne({ _id: req.body.id }).exec();

  if (!client) { return res.status(204).json({ 'message': `no client matches ID ${req.body.id}` }) };

  if (req?.body?.firstName) client.firstname = req.body.firstName;
  if (req?.body?.lastName) client.lastname = req.body.lastName;
  if (req?.body?.email) client.email = req.body.email;
  if (req?.body?.phoneNum) client.phone = req.body.phoneNum;

  const result = await client.save();
  res.json(result);


}

const deleteClient = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ 'message': 'Client ID required' });

  const client = await Client.findOne({ _id: req.body.id }).exec();
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
