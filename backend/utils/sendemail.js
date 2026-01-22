const nodemailer = require('nodemailer');

const sendEmail = async (subject, message, send_to, sent_from, reply_to, photo=null) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const options = {
      from: sent_from,
      to: send_to,
      replyTo: reply_to,
      subject: subject,
      html: message,
      attachments: photo ? [{ filename: photo.originalname, path: photo.path }] : []
    };

    const info = await transporter.sendMail(options);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email not sent, please try again');
  }
};

module.exports = sendEmail;
