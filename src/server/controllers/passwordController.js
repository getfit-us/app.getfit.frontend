const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleUpdatePassword = async (req, res) => {
  const { id, email, accessToken, password, password2, oldpassword } = req.body;
  console.log(`update password route ${id}`);

  if (!id || !email || !accessToken)
    return res.status(400).json({ message: "email and id required" });

  // find user
  const foundUser = await User.findOne({ _id: id }).exec();

  if (!foundUser) {
    return res.sendStatus(401);
  } //Unauthorized

  //check old password against DB
  const match = await bcrypt.compare(oldpassword, foundUser.password);

  if (match) {
    if (password !== password2)
      return res.status(400).json({ message: "passwords mismatch" });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      foundUser.password = hashedPassword;
      const result = await foundUser.save();
      res.status(200).json({ message: "Success" });
      console.log(result);
    } catch (err) {
      res.sendStatus(500).json({ message: err.message });
    }
  } else res.status(400).json({ message: "passwords mismatch" });
};

module.exports = { handleUpdatePassword };
