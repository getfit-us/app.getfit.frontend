const User = require("../model/User");
const Token = require("../model/Token");
const {sendEmail} = require("../middleware/nodemailer");
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

  // evaluate password
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    // check if user has not verified their email address
    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id }).exec();
      console.log("not verified");
      // token does not exist create and resend email
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
          count: 1,
        }).save();

        const url = `${process.env.BASE_URL}/verify/${user._id}/${token.token}`;
        await sendEmail(user.email, url); //send email with link to verify account - email addr / url
        console.log(url);
        return res.status(403).json({
          message:
            "A Email has been sent to your account. Please verify your account",
        });
      } else if (token && token.count === 3) {
        //if token does exit check count and if count is less then 3 do nothing , if greater then 3 send account disabled.

        return res.status(423).json({
          message: "Too many attempts, account is disabled", //account locked
        });
      } else {
        return res.status(403).json({
          message: "Email already sent, account not verified", //Unauthorized
        });

      }
    }

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
    const goals = user?.goals;
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
      goals,
      startDate,
      avatar,
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
