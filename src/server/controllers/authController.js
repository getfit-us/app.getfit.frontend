const User = require("../model/User");
const Token = require("../model/Token");
const sendEmail = require("../middleware/nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// need to add checks for email is verified before allowing login

const handleLogin = async (req, res) => {
  const cookies = req.cookies;

  const { email, password } = req.body;
  console.log(`Auth route hit: ${req.url} email:${email} password:${password}`);

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  const user = await User.findOne({ email }).exec();
  console.log(`found user: ${user?.email}`);
  if (!user) {
    return res.sendStatus(401);
  } //Unauthorized

  // if user has not verified their email address
  if (!user.verified) {
    let token = await Token.findOne({ userId: user._id }).exec();
    // token does not exist create and resend email
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;
      await sendEmail(user.email, url); //send email with link to verify account - email addr / url
      console.log(url);
      res.status(404).json({
        message:
          "A Email has been sent to your account. Please verify your account",
      });
    } 
  }

  // evaluate password
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const roles = Object.values(user.roles).filter(Boolean);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: user.email,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    const firstName = user.firstname;
    const lastName = user.lastname;
    const trainerId = user?.trainerId;
    const phone = user?.phone;
    const age = user?.age;
    const goal = user?.goal;
    const startDate = user?.date;
    const avatar = user?.avatar;

    const clientId = user._id;

    const result = await user.save();
    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      roles,
      accessToken,
      firstName,
      lastName,
      email,
      trainerId,
      clientId,
      phone,
      age,
      goal,
      startDate,
      avatar,
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
