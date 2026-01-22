const asyncHandler = require("express-async-handler");
const User = require("../models/usermodels");
const sendEmail = require("../utils/sendemail");
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('photo');

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const contactUs = asyncHandler(async (req, res) => {
  // File upload
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).json({ success: false, message: err });
    } else {
      console.log("Req Body:", req.body);
      const { subject, message } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        res.status(400);
        throw new Error("User not found, please signup");
      }

      // Validation
      if (!subject || !message) {
        res.status(400).json({ success: false, message: "Please add subject and message" });
        return; // Added return statement to exit the function if subject or message is missing
      }

      const htmlMessage = `
      <h1>Contact Us Request</h1>
      <p><strong>From:</strong> ${user.name}</p>
      <p><strong>Email:</strong>  &lt;${user.email}&gt;</p>
      <p><strong>Company:</strong> ${'yd Accesseries'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p>Best regards,</p>
      <p>${user.name}</p>
    `;

      const send_to = process.env.EMAIL_USER;
      const sent_from = process.env.EMAIL_USER;
      const reply_to = user.email;
      try {
        if (req.file) {
          await sendEmail(subject, htmlMessage, send_to, sent_from, reply_to, req.file);
        } else {
          await sendEmail(subject, htmlMessage, send_to, sent_from, reply_to);
        }
        res.status(200).json({ success: true, message: "Email Sent" });
      } catch (error) {
        res.status(500);
        throw new Error("Email not sent, please try again");
      }
    }
  });
});

module.exports = {
  contactUs,
};
