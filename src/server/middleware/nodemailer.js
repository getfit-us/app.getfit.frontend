const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  sendmail: true,
  newline: "unix",
  path: "/usr/sbin/sendmail",
});

const sendEmail = async (clientEmail, clientLink) => {
  const result = await transporter.sendMail({
    from: "verify@getfit.us",
    to: clientEmail,
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
