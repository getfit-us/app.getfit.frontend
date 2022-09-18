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

const sendEmail = async (clientEmail, clientLink) => {
  const result = await transporter.sendMail({
    from: "verify@getfit.us",
    to: 'chris@getfit.us',
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
  <h2>Please verify your email address </h2>
  <a href=${clientLink}>Verify your email address</a>
</body>
</html>`,
  });
  return result;
};

module.exports = sendEmail;
