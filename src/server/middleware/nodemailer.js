const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
  });

  const sendEmail =  async (clientEmail, clientLink) =>  {
   const result =  await transporter.sendMail({
        from: 'verify@getfit.us',
        to: clientEmail,
        subject: 'Verify Email Address',
        text: `Please Click the link to verify your email address and activate your account ${clientLink}.`
      });
      return result;
  }

  module.exports = sendEmail;
