const User = require("../model/User");
const Token = require("../model/Token");
const jwt = require("jsonwebtoken");
const Measurement = require("../model/Measurement");
const CompletedWorkout = require("../model/CompletedWorkout");
const path = require("path");
const fs = require("fs");
const { resetEmail } = require("../middleware/nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const updateUsers = async (req, res) => {
  console.log("update user route");

  if (!req?.body?._id) {
    return res.status(400).json({ message: "ID  required" });
  }
  const user = await User.findOne({ _id: req.body._id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `no user matches ID ${req.body.user}` });
  }

  if (req?.body?.firstname) user.firstname = req.body.firstname;
  if (req?.body?.lastname) user.lastname = req.body.lastname;
  if (req?.body?.email) user.email = req.body.email;
  if (req?.body?.phone) user.phone = req.body.phone;
  if (req?.body?.avatar) user.avatar = req.body.avatar;
  if (req?.body?.trainerId) user.trainerId = req.body.trainerId;
  if (req?.body?.roles) user.roles = req.body.roles;

  const result = await user.save();
  console.log(`User Update: ${result}`);
  res.json(result);
};

const getAllUsers = async (req, res) => {
  console.log("getallusers route");
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users);
};

const deleteUser = async (req, res) => {
  console.log(`client delete route ${req.params["id"]}`);

  if (!req.params["id"])
    return res.status(400).json({ message: "Client ID required" });

  const user = await User.findOne({ _id: req.params["id"] }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `no client matches ID ${req.body.id}` });
  }

  //find matching measurements and completed workouts from user to delete also
  //delete images associated with user
  const measurements = await Measurement.find({
    clientId: req.params["id"],
  }).exec();
  const completedWorkouts = await CompletedWorkout.find({
    clientId: req.params["id"],
  }).exec();

  //delete images associated

  //avatar images
  if (fs.existsSync(`${__dirname}/../public/avatar_images/${user.avatar}`)) {
    fs.unlink(
      `${__dirname}/../public/avatar_images/${user.avatar}`,
      function (err) {
        if (err) return console.log(err);
        console.log(`old image ${user.avatar} deleted successfully `);
      }
    );
  }
  // measurements images
  if (measurements) {
    measurements.map((measurement) => {
      if (measurement.images.length > 0) {
        measurement.images.map((image) => {
          //for each image, delete the image
          if (
            fs.existsSync(`${__dirname}/../public/measurement_images/${image}}`)
          ) {
            fs.unlink(
              `${__dirname}/../public/measurement_images/${image}`,
              function (err) {
                if (err) return console.log(err);
                console.log(`old image ${image} deleted successfully `);
              }
            );
          }
        });
      }
    });
    //delete associated measurements
    const measurementdelete = await Measurement.deleteMany({
      clientId: req.params["id"],
    }).exec();
    console.log(measurementdelete);
  }

  if (completedWorkouts) {
    // delete associated completedWorkouts
    const completedWorkoutsdelete = await CompletedWorkout.deleteMany({
      clientId: req.params["id"],
    }).exec();
    console.log(completedWorkoutsdelete);
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getUser = async (req, res) => {
  console.log("get user params route");

  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.params.id} not found` });
  }

  res.json(user);
};

const getTrainer = async (req, res) => {
  console.log(`get Trainer Route`);

  if (!req?.params?.id)
    return res.status(400).json({ message: "Trainer ID required" });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.params.id} not found` });
  }

  // return the trainer contact details

  res.json({
    firstname: user.firstname,
    lastname: user.lastname,
    phone: user.phone,
    email: user.email,
    avatar: user.avatar
  });
};

const updateSelf = async (req, res) => {
  console.log(`update self route with user already logged in`);

  //allow current user to update there profile or info
  if (!req?.params?.id)
    return res.status(400).json({ message: "User ID required" });
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.params.id} not found` });
  }

  //verify current request is trying to modify only their account

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  if (user.refreshToken !== refreshToken) return res.sendStatus(403);

  if (req?.body?.firstName) user.firstname = req.body.firstName;
  if (req?.body?.lastName) user.lastname = req.body.lastName;
  if (req?.body?.email) user.email = req.body.email;
  if (req?.body?.phone) user.phone = req.body.phone;
  if (req?.body?.goal) user.goal = req.body.goal;

  const result = await user.save();
  console.log(`User Update: ${result}`);
  res.json(result);
};

const verifyEmail = async (req, res) => {
  // find user
  console.log("verifyEmail route", req.params);
  try {
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
      return res.status(403).json({ message: "Invalid Link" });
    }
    // if user exists verify token is correct
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    }).exec();
    if (!token) {
      return res.status(403).json({ message: "Invalid Link" });
    } //Unauthorized
    // if token is correct update user account verified to true
    const result = await User.updateOne(
      { _id: user._id },
      { verified: true }
    ).exec();
    await token.remove();

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal error" });
  }
};

const resetPassword = async (req, res) => {
  // find user with matching email
  console.log("verifyEmail to update user password", req.body);
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(403).json({ message: "Invalid email" });
    }
    //check if token already exists
    const existingToken = await Token.findOne({ userId: user._id }).exec();
    if (existingToken) {
      // if token already exists check count / =3 disable account , less then 3 add to count and reset email.
      if (existingToken.count === 3) {
        user.verified = false;
        await user.save();
        res.status(403).json({ message: "too many tries, account locked" });
      } else if (existingToken.count < 3) {
        // increase count and resend email
        existingToken.count = existingToken.count + 1;
        await existingToken.save();
        const url = `${process.env.BASE_URL}/forgot-password/${user._id}/${existingToken.token}`;
        const result = await resetEmail(user, url);
        return res.status(200).json({ message: "Email Sent" });
      }
    }

    // if user exists and no existing token , create token and send link to email with reset password link

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
      count: 1,
    }).save();

    const url = `${process.env.BASE_URL}/forgot-password/${user._id}/${token.token}`;
    // send email to user with reset password link
    const result = await resetEmail(user, url); //user object with link to verify account - user / url

    res.status(200).json({ message: "Email Sent" }); // need to change this in production environment
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal error" });
  }
};

const validateResetLink = async (req, res, next) => {
  // find user
  console.log("validate  reset link", req.params);
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) return res.status(400).json({ message: "Invalid Link" });
  const token = await Token.findOne({
    userId: req.params.id,
    token: req.params.token,
  }).exec();
  if (!token) return res.status(400).json({ message: "Invalid Link" });
  // if token is correct delete token and redirect to form.
  await token.remove();
  return res.status(200).json({ message: "Link verified" });
};

const UpdatePassword = async (req, res, next) => {
  // find user
  console.log("update password route", req.body);
  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) return res.status(400).json({ message: "Invalid Link" });

  //check if both passwords match
  if (req.body?.password !== req.body?.password2)
    return res.status(400).json({ message: "Passwords do not match" });
  // update user password
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password Updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal error" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getUser,
  updateUsers,
  getTrainer,
  updateSelf,
  verifyEmail,
  resetPassword,
  validateResetLink,
  UpdatePassword,
};
