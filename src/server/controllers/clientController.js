//temp before database implementation
const User = require("../model/User");

const getAllClients = async (req, res) => {
  console.log("get all client data");
  const clients = await User.find({ trainerId: req.params["id"] });

  if (!clients) return res.status(204).json({ message: "no clients found" }); // no content

  console.log(clients);
  // filter out password from results
  const filteredClients = [];
  clients.map((client) => {
    if (client.password) {
      client.password = null;
      filteredClients.push(client);
    }
  });
  res.json(filteredClients);
};

const updateClient = async (req, res) => {
  console.log("update client route");

  if (!req.body?.id) {
    return res.status(400).json({ message: "ID  required" });
  }

  const client = await User.findOne({ _id: req.body?.id }).exec();

  if (!client) {
    return res.status(204).json({ message: `Client Not Found` });
  }

  if (req?.body?.firstname) client.firstname = req.body.firstname;s
  if (req?.body?.lastname) client.lastname = req.body.lastname;
  if (req?.body?.email) client.email = req.body.email;
  if (req?.body?.phone) client.phone = req.body.phone;
  if (req?.body?.age) client.age = req.body.age;

  const result = await client.save();
  res.json(result);
};

const deleteClient = async (req, res) => {
  console.log(`client delete route ${req.params["id"]}`);

  if (!req.params["id"])
    return res.status(400).json({ message: "Client ID required" });

  const client = await User.findOne({ _id: req.params["id"] }).exec();
  if (!client) {
    return res
      .status(204)
      .json({ message: `no client matches ID ${req.body.id}` });
  }

  const result = await client.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getClient = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Client ID required" });
  const client = await User.findOne({ _id: req.params.id }).exec();
  if (!client) {
    return res
      .status(204)
      .json({ message: `no client matches ID ${req.params.id}` });
  }

  res.json(client);
};

module.exports = {
  getAllClients,

  updateClient,
  deleteClient,
  getClient,
};
