const nodemailer = require("nodemailer");
//for dev
const transporter = nodemailer.createTransport({
  host: "mail.getfit.us",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "chris",
    pass: "C$404117763",
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });
// const test =  transporter.verify()
// console.log(test)

//used for deployment on server
// const transporter = nodemailer.createTransport({
//   sendmail: true,
//   newline: "unix",
//   path: "/usr/sbin/sendmail",
// });

//takes user object so you can access any properties in the email

const sendEmail = async (user, clientLink) => {
  const result = await transporter.sendMail({
    from: "verify@getfit.us",
    to: "chris@getfit.us", // will be user.email
    subject: "Verify Email Address",
    html: `
        <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Welcome to GetFit</title>
</head>
<body>
  Hello ${user.firstname},

  <h2>Please verify your email address to activate your account</h2>
  <a href=${clientLink}>Verify your email address</a>
  <p>Thank you for becoming a part of the family!</p>
  <p>Lets Get Fit</p>
</body>
</html>`,
  });
  return result;
};

//takes user object first  so you can access any properties in the email

const resetEmail = async (user, clientLink) => {
  const result = await transporter.sendMail({
    from: "verify@getfit.us",
    to: "chris@getfit.us", // will be user.email
    subject: "Reset Password",
    html: `
        <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Reset Password</title>
</head>
<body>
 

  <h2>Please verify your email address to reset your password</h2>
  <a href=${clientLink}>Reset Password</a>
  
</body>
</html>`,
  });
  return result;
};

module.exports = { sendEmail, resetEmail };
